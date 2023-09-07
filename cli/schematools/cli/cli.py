import argparse

from ..compiler import RegexCompiler
from ..validator import RegexValidator


def validate_cli():
    """
    Runs the validate cli.
    """
    # Parse arguments
    args = parse_args_validate()
    # Create validator
    validator = RegexValidator()
    # Validate
    print(validator.validate(args.text))


def parse_args_validate():
    """
    Parses the validate program's command line arguments.

    Returns:
        dict: The program's command line arguments.
    """
    parser = argparse.ArgumentParser(
        description="A small command line tool for validating text."
    )
    parser.add_argument("-t", "--text", type=str, required=True)
    return parser.parse_args()
    pass


def compile_cli():
    """
    Runs the compile cli.
    """
    # Parse arguments
    args = parse_args_compile()
    # Create compiler
    compiler = RegexCompiler(RegexValidator())
    # Validate
    print(compiler.compile(args.text))


def parse_args_compile():
    """
    Parses the compile program's command line arguments.

    Returns:
        dict: The program's command line arguments.
    """
    parser = argparse.ArgumentParser(
        description="A small command line tool for compiling text."
    )
    parser.add_argument("-t", "--text", type=str, required=True)
    return parser.parse_args()
