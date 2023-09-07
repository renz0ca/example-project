import re

from .Validator import Validator


class RegexValidator(Validator):
    def __init__(self):
        """
        Creates a new RegexValidator.
        """
        self.__validator = r"^\d{4}\s+\D+$"

    def validate(self, string):
        """
        Tests if a string is valid.

        Args:
            string (str): The string to test.

        Returns:
            bool: True if the string is valid, false otherwise.
        """
        if type(string) is string:
            return re.match(self.__validator, string) is not None
        else:
            raise TypeError("Expected string.")
