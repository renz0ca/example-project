import argparse
import os

from ..page.generator import PageGenerator


def generate_cli():
    """
    Runs the cli.
    """
    # Parse arguments
    args = parse_args()
    # Create generator
    generator = PageGenerator(args.text)
    # Prepare folder
    if not os.path.exists(args.path):
        os.makedirs(args.path)
    # Generate html
    with open(os.path.join(args.path, "index.html"), 'w') as file:
        file.write(generator.generate().strip())


def parse_args():
    """
    Parses the program's command line arguments.

    Returns:
        dict: The program's command line arguments.
    """
    parser = argparse.ArgumentParser(
        description="A small command line tool to generate pages."
    )
    parser.add_argument("-t", "--text", type=str, required=True)
    parser.add_argument("-p", "--path", type=str, default="./dist")
    return parser.parse_args()
