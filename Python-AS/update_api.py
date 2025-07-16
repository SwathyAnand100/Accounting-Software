import create_api
import data_layer
import http.server
import configparser
import json

consts = configparser.RawConfigParser()
consts.read('constants.ini')

class update_API(http.server.BaseHTTPRequestHandler):
    def do_POST(self):
        """
        This method is called whenever there is a post action 
        performed in the front end in port 8002
        """
        if self.path == consts['SERVER']['update_path']:
            data = create_api.read_data(self)
            response_data = {}
            if data[consts['FIELDS']['tableName']] == consts['MYSQL']['AM_table']:
                params = (data[consts['FIELDS']['AccName']],)
                result = data_layer.retrieve_record(data[consts['FIELDS']['tableName']],params)
                if result is not None:
                    print(result)
                    params = (data[consts['FIELDS']['AccDesc']], data[consts['FIELDS']['CategoryType']], data[consts['FIELDS']['AccName']])
                    data_layer.update_record(consts['MYSQL']['AM_table'], params)
                    response_data[consts['FIELDS']['message']] =  consts['MESSAGES']['record_updated']
                else:
                    response_data[consts['FIELDS']['message']] = consts['MESSAGES']['record_not_found']

            elif data[consts['FIELDS']['tableName']] == consts['MYSQL']['T_table']:
                params = (data[consts['FIELDS']['TranName']],data[consts['FIELDS']['Date']])
                result = data_layer.retrieve_record(data[consts['FIELDS']['tableName']], params)
                if result is not None:
                    print(result)
                    params = (data[consts['FIELDS']['TranDesc']], data[consts['FIELDS']['Amount']], data[consts['FIELDS']['AccName']], data[consts['FIELDS']['TranName']], data[consts['FIELDS']['Date']])
                    data_layer.update_record(consts['MYSQL']['T_table'], params)
                    response_data[consts['FIELDS']['message']] =  consts['MESSAGES']['record_updated']
                else:
                    response_data[consts['FIELDS']['message']] = consts['MESSAGES']['record_not_found']
            print(response_data)
            self.send_response(200)
            self.send_header(consts['CORS']['allow_cors'], consts['SERVER']['url']+consts['SERVER']['port_frontend']) #pylint: disable=line-too-long
            self.send_header(consts['CORS']['allow_headers'], '*')
            self.send_header(consts['HEADER']['content_type'], consts['HEADER']['sending_type'])
            self.end_headers()
            self.wfile.write(json.dumps(response_data).encode())

    def do_OPTIONS(self):
        """Handle preflight CORS requests"""
        print("Goes to OPTIONS")
        self.send_response(204)  # No Content
        self.send_header(consts['CORS']['allow_cors'], consts['SERVER']['url']+consts['SERVER']['port_frontend']) #pylint: disable=line-too-long
        self.send_header(consts['CORS']['allow_methods'], consts['SERVER']['post_options'])
        self.send_header(consts['CORS']['allow_headers'], '*')
        self.end_headers()

def run_update(server_class = http.server.HTTPServer, handler_class = update_API):
    """This function creates an HTTP server instance bound to local host
        and port 8002, and starts it to listen for incoming requests indefinitely.
    
    Args:
        server_class (HTTPServer) - to create an instance of this class
        handler_class (BaseHTTPRequestHandler) - to handle incoming HTTP requests
    """
    server_address = (consts['SERVER']['host'], int(consts['SERVER']['port_update']))
    httpd = server_class(server_address, handler_class) #HTTP server instance
    httpd.serve_forever()