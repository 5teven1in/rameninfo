#!/usr/bin/env python
import argparse
import json
import logging
import os
import random
import re
import time
import urllib.parse
from typing import Final, Optional, Union

import bs4
import requests

import argparse_helper

class RameninfoUpdater:
    INFO_FB: Final[str] = 'fb'
    INFO_GOOGLE_MAP: Final[str] = 'googleMap'
    INFO_INSTAGRAM: Final[str] = 'instagram'
    INFO_OPENING_TIME: Final[str] = 'openingTime'

    def __init__(self):
        self._fb_url_reg = re.compile('^https://www.facebook.com/')
        self._fb_zh_tw_url_reg = re.compile('^https://zh-tw.facebook.com/')
        self._fb_m_url_reg = re.compile('^https://m.facebook.com/')
        self._instagramb_url_reg = re.compile('^https://www.instagram.com/')

    def add_google_info(
        self,
        rameninfo_file: str,
        google_search_dir: str,
        output_file: str,
        info_items: Optional[list[str]],
        is_review_mode: bool,
        manual_correction_disabled: bool,
    ) -> None:
        """Add info from Google search result to rameninfo data.

        Args:
            rameninfo_file: rameninfo file as src/assets/awesome.json.
            google_search_dir: Directory contains Google search result files.
            output_file: Output file.
            info_items: Info items to be added from Google search result. If not given, add all items.
            is_review_mode: Whether review mode is enabled. If enabled, metadata of information is added for check.
            manual_correction_disabled: Whether manual correction is disabled. If disabled, the manual correction won't
                be applied.
        """
        with open(rameninfo_file, 'r') as f:
            rameninfos = json.load(f)

        if info_items is None:
            info_items = [
                RameninfoUpdater.INFO_FB,
                RameninfoUpdater.INFO_GOOGLE_MAP,
                RameninfoUpdater.INFO_INSTAGRAM,
                RameninfoUpdater.INFO_OPENING_TIME,
            ]

        unique_info_items = set(info_items)
        for rameninfo in rameninfos:
            for item in (
                RameninfoUpdater.INFO_FB,
                RameninfoUpdater.INFO_GOOGLE_MAP,
                RameninfoUpdater.INFO_INSTAGRAM,
            ):
                if item not in rameninfo:
                    rameninfo[item] = None

            if RameninfoUpdater.INFO_OPENING_TIME not in rameninfo:
                rameninfo[RameninfoUpdater.INFO_OPENING_TIME] = {
                    'closedMessage': None,
                    'days': None,
                    'note': None,
                }

            google_search_file = os.path.join(google_search_dir, rameninfo['name'] + '.html')
            if not os.path.isfile(google_search_file):
                logging.warning(f"Google search file '{google_search_file}' is not found. skip")
                continue

            with open(google_search_file, 'r') as f:
                soup = bs4.BeautifulSoup(f, 'html.parser')
                if RameninfoUpdater.INFO_FB in unique_info_items or \
                    RameninfoUpdater.INFO_INSTAGRAM in unique_info_items:
                    fb, instagram = self._extract_fb_instagram(
                        soup,
                        rameninfo['name'],
                        is_review_mode,
                        manual_correction_disabled)
                    if RameninfoUpdater.INFO_FB in unique_info_items and fb is not None:
                        rameninfo['fb'] = fb

                    if RameninfoUpdater.INFO_INSTAGRAM in unique_info_items and instagram is not None:
                        rameninfo['instagram'] = instagram

                if RameninfoUpdater.INFO_GOOGLE_MAP in unique_info_items:
                    google_map = self._extract_google_map_url(soup, is_review_mode)
                    if google_map is not None:
                        rameninfo['googleMap'] = google_map

                if RameninfoUpdater.INFO_OPENING_TIME in unique_info_items:
                    opening_time = self._extract_opening_time(soup, rameninfo['name'])
                    if opening_time is not None:
                        rameninfo['openingTime'] = opening_time

        with open(output_file, 'w') as f:
            json.dump(rameninfos, f, indent=2, ensure_ascii=False)

    def crawl_google_search(
        self,
        rameninfo_file: str,
        output_dir: str,
        google_search_http_info_file: str,
        ramen_store_name: Optional[str] = None,
        search_interval: int = 60,
    ) -> None:
        """Crawl Google search result.

        Args:
            rameninfo_file: rameninfo file as src/assets/awesome.js.
            output_dir: Output directory for Google search result.
            google_search_http_info_file: Google search http info file. See google_search_http_info_file.json.sample.
            ramen_store_name: Ramen store name. Default is None. If given, only crawl this store.
            search_interval: Interval of searchs in seconds. It will be added 1 ~ 10 seconds randomly for each
              search.
        """
        def _adjust_search_keyword(name: str) -> str:
            if name == '(0527暫休)Kitaho 北穗製麵所(6月中旬)':
               return 'Kitaho 北穗製麵所'
            elif name == 'Hiro’s らぁ麵Kitchen-台中三井店(0427開幕)':
                return 'Hiro’sらぁ麵Kitchen 台中Lalaport店'
            elif name == '(已閉店)銀座篝(易地重開)':
                return '銀座 篝 台中三井'
            elif name == '☆辣麻味噌拉麵 鬼金棒(總店拉麵部別館)':
                return '鬼金棒 中山別館',
            elif name == '豚人ラ－メン-長榮店':
                return '豚人拉麵長榮店 京都一乗寺豚人ラーメン 台南'
            elif name == '鷹流東京醤油拉麺【蘭丸ranmaru】新竹竹北店':
                return '鷹流東京醬油拉麵蘭丸 新竹竹北店'
            elif name == '麵屋壹の穴ichi-沾麵專門店':
                return '壹之穴沾麵專門店'
            elif name == '道樂ラーメン專門店':
                return '道樂拉麵 大北店'
            elif name == 'ラーメン凪 Ramen Nagi-天母店(北市／士林)':
                return 'ラーメン凪 Ramen Nagi-天母店'
            elif name == '長生塩人-北投店(北市／北投)':
                return '長生塩人-北投店'

            return name

        rameninfos = load_json_file(rameninfo_file)
        google_search_http_info = load_json_file(google_search_http_info_file)

        if not os.path.isdir(output_dir):
            os.makedirs(output_dir)

        for no, rameninfo in enumerate(rameninfos, 1):
            logging.info(f'[{no}/{len(rameninfos)}] {rameninfo["name"]} ...')

            if ramen_store_name is not None and rameninfo['name'] != ramen_store_name:
                continue

            search_keyword = _adjust_search_keyword(rameninfo['name'])
            if search_keyword != rameninfo['name']:
                logging.info(f'adjust search keyword to: {search_keyword}')

            output = self._search(
                search_keyword,
                google_search_http_info['payload'],
                google_search_http_info['headers'])
            with open(os.path.join(output_dir, rameninfo['name'] + '.html'), 'w') as f:
                print(output, file=f)

            time.sleep(search_interval + random.randint(1, 10))

    def _extract_fb_instagram(
        self,
        google_search_soup: bs4.BeautifulSoup,
        storeName: str,
        is_review_mode: bool,
        manual_correction_disabled: bool,
    ) -> tuple:
        fb = {
            'from_google_map': None,
            'from_search': None,
        }
        instagram = {
            'from_google_map': None,
            'from_search': None,
        }

        rso = google_search_soup.css.select('#rso')[0]
        site = rso.find(string='網站')
        if site is not None:
            if site.parent.name == 'div':
                href = site.parent.parent.attrs['href']
                url = self._extract_fb_main_site_from_url(href)
                if url is not None:
                    fb['from_google_map'] = url

                url = self._extract_instagram_main_site_from_url(href)
                if url is not None:
                    instagram['from_google_map'] = url

        # some is under the 5th div
        # some exceeds the 6th div
        for div in google_search_soup.css.select('#rso > div > div > div > div > div'):
            a_s = div.css.select('a')
            if not a_s:
                continue

            a = a_s[0]
            if 'href' not in a.attrs:
                continue

            href = a.attrs['href']
            if fb['from_search'] is None:
                url = self._extract_fb_main_site_from_url(href)
                if url is None:
                    continue

                h3 = a.find('h3')
                fb['from_search'] = {
                    'name': h3.text if h3 else None,
                    'url': url,
                }
            elif instagram['from_search'] is None:
                url = self._extract_instagram_main_site_from_url(href)
                if url is None:
                    continue

                h3 = a.find('h3')
                instagram['from_search'] = {
                    'name': h3.text if h3 else None,
                    'url': url,
                }

            if fb['from_search'] is not None and instagram['from_search'] is not None:
                break

        if not manual_correction_disabled:
            # manual corrections were based on previous crawled search results.
            if storeName == '豚人ラ－メン-長榮店':
                instagram['from_search'] = None
            elif storeName == '鳳華雞豚濃湯拉麵專門店-二號店':
                instagram['from_search'] = None
            elif storeName == '一幻拉麵-台北信義店':
                instagram['from_search'] = {
                    'name': '一幻拉麵｜北海道えびそば一幻 台灣（@ichigentw）• Instagram 相片與影片',
                    'url': 'https://www.instagram.com/ichigentw/',
                }
            elif storeName == '鳳華拉麵 （らぁ麺 鳳華）':
                instagram['from_search'] = {
                    'name': '鳳華 鶏豚濃湯拉麵專門 本店（@houou190917）• Instagram 相片與影片',
                    'url': 'https://www.instagram.com/houou190917/',
                }
            elif storeName == '麵屋 千雲 -Chikumo-':
                fb['from_search'] = {
                    'name': '麺屋千雲-Chikumo- | Taipei',
                    'url': 'https://www.facebook.com/menya.chikumo/',
                }
            elif storeName == '吉天元拉麵店-公館店':
                fb['from_search'] = None

        return (
            fb['from_search']['url'] if fb['from_search'] is not None else fb['from_google_map'],
            instagram['from_search']['url'] if instagram['from_search'] is not None else instagram['from_google_map'],
        ) if not is_review_mode else (fb, instagram)

    def _extract_fb_main_site_from_url(self, url: str) -> Optional[str]:
        if not (self._fb_url_reg.match(url) or self._fb_zh_tw_url_reg.match(url) or self._fb_m_url_reg.match(url)):
            return None

        url_struct = urllib.parse.urlparse(url)
        if url_struct.path != '/profile.php':
            url_struct = url_struct._replace(query='')

        if self._fb_zh_tw_url_reg.match(url) or self._fb_m_url_reg.match(url):
            url_struct = url_struct._replace(netloc='www.facebook.com')

        path_elems = [elem for elem in url_struct.path.split('/') if elem]
        if len(path_elems) > 1:
            key = None
            if path_elems[0] == 'p':
                key = path_elems[1]
            elif path_elems[1] in ('posts', 'photos'):
                key = path_elems[0]

            if key is not None:
                url_struct = url_struct._replace(path=f'/{key}/')

        return url_struct.geturl()

    def _extract_google_map_url(self, google_search_soup: bs4.BeautifulSoup, is_review_mode: bool) -> Optional[str]:
        imgs = google_search_soup.css.select('#lu_map')
        if not imgs:
            return None

        img = imgs[0]

        return 'https://www.google.com' + img.parent.attrs['data-url'] if not is_review_mode else \
            {
                'name': img.attrs['title'],
                'url': 'https://www.google.com' + img.parent.attrs['data-url'],
            }

    def _extract_instagram_main_site_from_url(self, url: str) -> Optional[str]:
        if not self._instagramb_url_reg.match(url):
            return None

        url_struct = urllib.parse.urlparse(url)._replace(query='')

        path_elems = [elem for elem in url_struct.path.split('/') if elem]
        if len(path_elems) == 2 and path_elems[0] == 'p':
            return None
        elif url_struct.path.find('/explore/tags/') == -1:
            return url_struct.geturl()

        return None

    def _extract_opening_time(self, google_search_soup: bs4.BeautifulSoup, storeName: str) -> dict:
        closed_divs = google_search_soup.css.select(
            '#rhs div[data-attrid="kc:/local:permanently closed"] > div > div > g-accordion-expander > div:first-child')
        if closed_divs:
            closed_div = closed_divs[0]
            return {
                'closedMessage': closed_div.text,
                'days': None,
                'note': None,
            }

        trs = google_search_soup.css.select(
            '#kp-wp-tab-overview div[data-attrid="kc:/location/location:hours"] table > tr')
        if not trs:
            if storeName == 'あお．実家和食処':
                return {
                    'closedMessage': None,
                    'days': [
                        ['休息'],
                        ['休息'],
                        ['休息'],
                        ['休息'],
                        ['09:00–15:00'],
                        ['09:00–15:00'],
                        ['09:00–15:00'],
                    ],
                    'note': None,
                }
            elif storeName == '創作拉麵 悠然':
                return {
                    'closedMessage': None,
                    'days': None,
                    'note': '熟客預約制',
                }
            elif storeName == '麵屋浩Hiroshi':
                return {
                    'closedMessage': None,
                    'days': [
                        ['17:30–21:30'],
                        ['17:30–21:30'],
                        ['17:30–21:30'],
                        ['17:30–21:30'],
                        ['17:30–21:30'],
                        ['17:30–21:30'],
                        ['17:30–21:30'],
                    ],
                    'note': '不固定開，請看FB',
                }
            elif storeName == '長生塩人-台東店(台東／台東)':
                return {
                    'closedMessage': None,
                    'days': [
                        ['17:00–01:00'],
                        ['17:00–01:00'],
                        ['17:00–01:00'],
                        ['17:00–01:00'],
                        ['17:00–01:00'],
                        ['17:00–01:00'],
                        ['17:00–01:00'],
                    ],
                    'note': None,
                }

            return None

        hour_ranges_by_day = {}
        for tr in trs:
            tds = tr.find_all('td')
            day_of_week_td = tds[0]
            day_of_week = day_of_week_td.string
            hour_range_td = tds[1]
            hour_ranges = hour_range_td.string.split(', ')

            for i, hour_range in enumerate(hour_ranges):
                if hour_range == '24 小時營業':
                    hour_ranges[i] = '00:00–24:00'

            day = {
                '星期日': 0,
                '星期一': 1,
                '星期二': 2,
                '星期三': 3,
                '星期四': 4,
                '星期五': 5,
                '星期六': 6,
            }[day_of_week]
            hour_ranges_by_day[day] = hour_ranges

        return {
            'closedMessage': None,
            'days': [hour_ranges_by_day.get(day, []) for day in range(7)],
            'note': None,
        }

    def _search(self, keyword: str, payload: dict, headers: dict) -> str:
        payload['q'] = keyword
        payload['oq'] = keyword
        req = requests.get('https://www.google.com/search', params=payload, headers=headers)

        return req.text


def get_path_under_script_dir(filepath: str) -> str:
    return os.path.join(os.path.dirname(os.path.realpath(__file__)), filepath)


def load_json_file(filepath: str) -> Union[list, dict]:
    with open(filepath, 'r') as f:
        return json.load(f)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description='Update ramen info')
    subparsers = parser.add_subparsers(dest='action', help='Actions', required=True)

    ramen_info_items = [
        RameninfoUpdater.INFO_FB,
        RameninfoUpdater.INFO_GOOGLE_MAP,
        RameninfoUpdater.INFO_INSTAGRAM,
        RameninfoUpdater.INFO_OPENING_TIME,
    ]
    subparser = subparsers.add_parser(
        'add_google_info',
        help='Add Google info from crawled file to rameninfo file',
        formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    subparser.add_argument(
        '--rameninfo_file',
        type=argparse_helper.filepath_str,
        help='ramen info JSON file as src/assets/awesome.js',
        required=True)
    subparser.add_argument(
        '--google_search_dir',
        type=argparse_helper.dirpath_str,
        help='Directory of crawled Google search result files',
        required=True)
    subparser.add_argument('--output_file', help='Output file', required=True)
    subparser.add_argument(
        '--info_items',
        type=argparse_helper.str_choices(ramen_info_items),
        default=','.join(ramen_info_items),
        help=''.join([
            'Info items to be added from Google Search.',
            f"Available items are {', '.join(ramen_info_items)}.",
            "Multiple items are separated by ','",
        ]))
    subparser.add_argument(
        '--review',
        default=False,
        action='store_true',
        dest='is_review_mode',
        help='Whether enable review mode. If enabled, metadata of information is added for check.')
    subparser.add_argument(
        '--disable_manual_correction',
        default=False,
        action='store_true',
        dest='manual_correction_disabled',
        help="Whether manual correction is disabled. If disabled, manual correction won't be applied.")

    subparser = subparsers.add_parser(
        'crawl_google_search',
        help='Crawl Google search API result',
        formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    subparser.add_argument(
        '--rameninfo_file',
        type=argparse_helper.filepath_str,
        help='ramen info JSON file as src/assets/awesome.js',
        required=True)
    subparser.add_argument('--output_dir', help='Directory contains Google search result files', required=True)
    subparser.add_argument(
        '--google_search_http_info_file',
        type=argparse_helper.filepath_str,
        default=get_path_under_script_dir('google_search_http_info.json'),
        help='Google search http info JSON file')
    subparser.add_argument(
        '--ramen_store_name',
        help='The ramen store name from src/assets/awesome.js. If given, only crawl this store.')
    subparser.add_argument(
        '--search_interval',
        type=argparse_helper.positive_int,
        default=60,
        help='Interval of Google searchs in seconds.')

    return parser.parse_args()


def main(args: argparse.Namespace):
    logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s', datefmt='%Y-%m-%d %H:%M:%S')

    rameninfoUpdater = RameninfoUpdater()
    if args.action == 'add_google_info':
        rameninfoUpdater.add_google_info(
            args.rameninfo_file,
            args.google_search_dir,
            args.output_file,
            args.info_items,
            args.is_review_mode,
            args.manual_correction_disabled)
    elif args.action == 'crawl_google_search':
        rameninfoUpdater.crawl_google_search(
            args.rameninfo_file,
            args.output_dir,
            args.google_search_http_info_file,
            args.ramen_store_name,
            args.search_interval)


if __name__ == '__main__':
    main(parse_args())
