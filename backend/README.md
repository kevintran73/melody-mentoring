# Quick start instructions

### Here for the first time:

*Recommend using a virtual env to run the python server

Welcome back, odds are if we've worked on the backend we've used new requirements.<br>
If you aren't working through docker, ensure you're running python version 3.10.11. If you're unsure,`py --version` or `python3 --version` to check.

*If you already have another python version installed, I recommend using some external addon like `pyenv` to manage your different python versions.

Librosa doesn't play nice with our other packages so to install the requirements please, in this directory:

- run `pip install librosa` then,
- run `pip install -r requirements.txt`


### To start the server
- `python server.py` or `python3 server.py`
