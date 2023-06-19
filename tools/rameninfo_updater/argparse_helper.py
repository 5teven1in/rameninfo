import argparse
import collections
import os

def str_choices(choices: list[str], sep=',') -> collections.abc.Callable[[str], list]:
    choices = choices.copy()

    def _str_choices(value: str) -> list[str]:
        items = value.split(sep)
        unique_choices = set(choices)
        for item in items:
            if item not in unique_choices:
                raise argparse.ArgumentTypeError(f"'{item}' is invalid. Available items are {', '.join(choices)}")

        return items

    return _str_choices


def dirpath_str(value:str ) -> str:
    if not os.path.isdir(value):
        raise argparse.ArgumentTypeError(f"'{value}' is not found")

    return value


def filepath_str(value: str) -> str:
    if not os.path.isfile(value):
        raise argparse.ArgumentTypeError(f"'{value}' is not found")

    return value


def positive_int(value: str) -> int:
    try:
        value_float = float(value)
        if value_float <= 0:
            raise ValueError

        value_int = int(value_float)
        if value_float != value_int:
            raise ValueError

        return value_int
    except ValueError:
        raise argparse.ArgumentTypeError('should be positive integer')
