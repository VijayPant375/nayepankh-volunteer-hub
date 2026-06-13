import urllib.request
import re

try:
    html = urllib.request.urlopen('https://nayepankh.com').read().decode('utf-8')
    match = re.search(r'img.*?src=[\'"]([^\'"]+logo[^\'"]+)[\'"]', html, re.I)
    if match:
        print("URL: " + match.group(1))
    else:
        print("Logo not found in HTML.")
except Exception as e:
    print(e)
