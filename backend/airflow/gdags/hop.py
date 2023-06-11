class EditAccessProcess:
    def __init__(self, file):
        self.file = file

    def request_edit(self, path):
        config = open(self.file, "w")
        config.write(path)
        config.close()