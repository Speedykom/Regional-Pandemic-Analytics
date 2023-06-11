import os
from datetime import datetime

def get_file_ext (filename: str):
    extension = os.path.splitext(filename)[1]
    return extension

def gen_filename (filename: str):
    dt_obj = datetime.utcnow()
    name = int(float(dt_obj.strftime('%s.%f')) * 1e6)
    return {'newName': f'{name}{get_file_ext(filename)}', 'id': name}
