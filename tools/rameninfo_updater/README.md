# ranmeninfo updater

Updater adds or updates ramen store information in 'src/assets/awesome.json'. The information includes Google map URL, opening time, FB link and instagram link.

## Setup

Create Python virtual environment and install packages.

```shell
pipenv install
```

Prepare HTTP payload and header for request.

```shell
cp google_search_http_info.json.sample google_search_http_info.json
```

Fill up 'AQS' and 'client' of 'payload', and 'cookie' of 'headers'.

## Update rameninfo

Enter virtual environment.

```shell
pipenv shell
```

### Crawl Google search

Crawl all ramen stores.

```shell
python rameninfo_updater.py crawl_google_search --rameninfo_file awesome.json --output_dir google_search --google_search_http_info_file google_search_http_info.json
```

Crawled certain ramen store.

```shell
python rameninfo_updater.py crawl_google_search --rameninfo_file awesome.json --output_dir google_search --google_search_http_info_file google_search_http_info.json --ramen_store_name 'RAMEN_STORE_NAME'

# For example
python rameninfo_updater.py crawl_google_search --rameninfo_file awesome.json --output_dir google_search --google_search_http_info_file google_search_http_info.json --ramen_store_name 'Okaeriお帰り吃碗拉麵吧'
```

`--ramen_store_name` could be used in the following situations

- adjust search keyword of ramen store for better result
- only want to crawly new ramen stores added to awesome.json
- failed to crawl and try again

### Add information from Google search results

Add all information.

```shell
python rameninfo_updater.py add_google_info --rameninfo_file awesome.json --google_search_dir google_search --output_file awesome.new.json
```

Add metadata of the information for checking whether the information is correct easily.

```shell
python rameninfo_updater.py add_google_info --rameninfo_file awesome.json --google_search_dir google_search --output_file test.json --review
```

Add certain information items.

```shell
python rameninfo_updater.py add_google_info --rameninfo_file awesome.json --google_search_dir google_search --output_file test.json --info_items fb,openingTime
```

Add information without manual correction. This could be used to check whether there are new changes from new crawled search results.

```shell
python rameninfo_updater.py add_google_info --rameninfo_file awesome.json --google_search_dir google_search --output_file test.json --disable_manual_correction
```

