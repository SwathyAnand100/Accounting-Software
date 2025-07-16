import threading

import create_api
import retrieve_api
import update_api
import delete_api
import GetAPI

threads = [
    threading.Thread(target = create_api.run_create),
    threading.Thread(target = retrieve_api.run_retrieve),
    threading.Thread(target = update_api.run_update),
    threading.Thread(target = delete_api.run_delete),
    threading.Thread(target = GetAPI.run_getaccounts)
]

for i in threads:
    i.start()

for i in threads:
    i.join()
