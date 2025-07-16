import json
import configparser
import http.server

import data_layer
import create_api

consts = configparser.RawConfigParser()
consts.read('constants.ini')

class retrieve_api(http.server.BaseHTTPRequestHandler):
    """
    This method is called whenever there is a post action 
    performed in the front end in port 8001
    """
    def do_POST(self):
        print("Enter retrieve")
        if self.path == consts['SERVER']['retrieve_path']:
            data = create_api.read_data(self)
            #print("data = ", data)
            response_data = {}
            if data[consts['FIELDS']['tableName']] == consts['MYSQL']['AM_table']:
                print("Into AM table:")
                params = (data[consts['FIELDS']['AccName']],)
                result = data_layer.retrieve_record(data[consts['FIELDS']['tableName']], params)
                if result is None:
                    response_data[consts['FIELDS']['message']] = consts['MESSAGES']['record_not_found']
                else:
                    #{0: 'Asset', 1: 'Liability'}
                    print(result)
                    response_data[consts['FIELDS']['message']] = ''
                    response_data[consts['FIELDS']['AccName']] = result[0]
                    response_data[consts['FIELDS']['AccDesc']] = result[1]
                    response_data[consts['FIELDS']['CategoryType']] = result[2]
            
            elif data[consts['FIELDS']['tableName']] == consts['MYSQL']['T_table']:
                print("Into Transactiosn table")
                params = (data[consts['FIELDS']['Date']],)
                result = data_layer.retrieve_record(data[consts['FIELDS']['tableName']], params)
                if result is None:
                    response_data[consts['FIELDS']['message']] = consts['MESSAGES']['no_record_date']
                else:
                    #print(result)
                    response_data['result'] = result
                    # response_data[consts['FIELDS']['message']] = ''
                    # response_data[consts['FIELDS']['TranName']] = result[0]
                    # response_data[consts['FIELDS']['TranDesc']] = result[1]
                    # #response_data[consts['FIELDS']['Date']] = result[2]
                    # response_data[consts['FIELDS']['Amount']] = float(result[3])
                    # response_data[consts['FIELDS']['AccName']] = result[4]

            print("response data = ",response_data)
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

def run_retrieve(server_class = http.server.HTTPServer, handler_class = retrieve_api):
    """This function creates an HTTP server instance bound to local host
        and port 8003, and starts it to listen for incoming requests indefinitely.
    
    Args:
        server_class (HTTPServer) - to create an instance of this class
        handler_class (BaseHTTPRequestHandler) - to handle incoming HTTP requests
    """
    server_address = (consts['SERVER']['host'], int(consts['SERVER']['port_retrieve']))
    httpd = server_class(server_address, handler_class) #HTTP server instance
    httpd.serve_forever()