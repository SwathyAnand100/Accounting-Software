import json
import configparser
import http.server

import create_api
import data_layer

consts = configparser.RawConfigParser()
consts.read('constants.ini')

class delete_api(http.server.BaseHTTPRequestHandler):
    def do_POST(self):
        """
        This method is called whenever there is a post action 
        performed in the front end in port 8003
        """
        print("POST DELETE CAUGHT")
        if self.path == consts['SERVER']['delete_path']:
            print("delete_api")
            data = create_api.read_data(self)
            response_data = {}
            if data[consts['FIELDS']['tableName']] == consts['MYSQL']['AM_table']:
                print("into AM table")
                params = (data[consts['FIELDS']['AccName']],)
                result = data_layer.retrieve_record(data[consts['FIELDS']['tableName']],params)
                print(result)
                if result is not None:
                    print(result)
                    # check if same id is present in tran table:
                    result = data_layer.get_transactionList((data[consts['FIELDS']['AccName']],))
                    if result>0:
                        response_data[consts['FIELDS']['message']] = consts['MESSAGES']['delete_failed']
                    else:
                        params = (data[consts['FIELDS']['AccName']],)
                        data_layer.delete_record(consts['MYSQL']['AM_table'], params)
                        response_data[consts['FIELDS']['message']] = consts['MESSAGES']['record_deleted']
                else:
                    response_data[consts['FIELDS']['message']] = consts['MESSAGES']['record_not_exists']

            elif data[consts['FIELDS']['tableName']] == consts['MYSQL']['T_table']:
                params = (data[consts['FIELDS']['TranName']],data[consts['FIELDS']['Date']])
                result = data_layer.retrieve_record(data[consts['FIELDS']['tableName']], params)
                if result is not None:
                    print(result)
                    data_layer.delete_record(consts['MYSQL']['T_table'], params)
                    response_data[consts['FIELDS']['message']] = consts['MESSAGES']['record_deleted']
                else:
                    response_data[consts['FIELDS']['message']] = consts['MESSAGES']['record_not_exists']

            print(response_data)
            self.send_response(200)
            self.send_header(consts['CORS']['allow_cors'], consts['SERVER']['url']+consts['SERVER']['port_frontend']) #pylint: disable=line-too-long
            self.send_header(consts['CORS']['allow_headers'], '*')
            self.send_header(consts['HEADER']['content_type'], consts['HEADER']['sending_type'])
            self.end_headers()
            self.wfile.write(json.dumps(response_data).encode())

    def do_OPTIONS(self):
        """
        Handle preflight CORS requests
        """
        self.send_response(204)  # No Content
        self.send_header(consts['CORS']['allow_cors'], consts['SERVER']['url']+consts['SERVER']['port_frontend']) #pylint: disable=line-too-long
        self.send_header(consts['CORS']['allow_methods'], consts['SERVER']['post_options'])
        self.send_header(consts['CORS']['allow_headers'], '*')
        self.end_headers()

def run_delete(server_class = http.server.HTTPServer, handler_class = delete_api):
    """This function creates an HTTP server instance bound to local host
        and port 8003, and starts it to listen for incoming requests indefinitely.
    
    Args:
        server_class (HTTPServer) - to create an instance of this class
        handler_class (BaseHTTPRequestHandler) - to handle incoming HTTP requests
    """
    server_address = (consts['SERVER']['host'], int(consts['SERVER']['port_delete']))
    httpd = server_class(server_address, handler_class) #HTTP server instance
    httpd.serve_forever()
            