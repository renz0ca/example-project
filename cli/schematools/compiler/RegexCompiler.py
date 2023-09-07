import re

from .Compiler import Compiler


class RegexCompiler(Compiler):
    def __init__(self, validator):
        """
        Creates a new Compiler.

        Args:
            validator (Validator): The validator to use.
        """
        self.__validator = validator

    def compile(self, string):
        """
        Compiles a string.

        Args:
            string (str): The string to compile.

        Returns:
            dict: The compiled string.
        """
        if self.__validator.validate(string):
            return {
                "id": re.findall(r"^\d{4}", string)[0],
                "title": re.findall(r"(?<=\d{4})\D+", string)[0].strip(),
            }
        else:
            raise ValueError("Invalid string, cannot compile.")

    def random():
        pass
