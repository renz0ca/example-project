class PageGenerator:

    def __init__(self, text):
        """
        Creates a PageGenerator.

        Args:
            text (str): The page's text.
        """
        if isinstance(text, str):
            self.__text = text
        else:
            raise TypeError("String expected.")

    def generate(self):
        """
        Generates a page.

        Returns:
            str: The generated page.
        """
        return """
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Generated Page</title>
                </head>
                <body>
                    <h1>Generated Page</h1>
                    <p>Generated Page Text:</p>
                    <p>""" + self.__text + """</p>
                </body>
            </html>
        """
