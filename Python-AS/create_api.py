import http.server
import json
import configparser
import data_layer

consts = configparser.RawConfigParser()
consts.read('constants.ini')


def read_data(http = http.server.BaseHTTPRequestHandler):
    response_len = int(http.headers[consts['HEADER']['content_length']])
    response = http.rfile.read(response_len)
    data = json.loads(response)
    #cat_type = {'Asset':0, 'Liability': 1, 'Income': 0, 'Expense': 1, '': None}
    full_data = {}
    if data[consts['FIELDS']['tableName']] == 'AccountMaster':
        full_data[consts['FIELDS']['AccName']] = data[consts['FIELDS']['AccName']]
        full_data[consts['FIELDS']['AccDesc']] = data[consts['FIELDS']['AccDesc']]
        full_data[consts['FIELDS']['CategoryType']] = data[consts['FIELDS']['CategoryType']]
        full_data[consts['FIELDS']['tableName']] = data[consts['FIELDS']['tableName']]
    else:
        full_data[consts['FIELDS']['TranName']] = data[consts['FIELDS']['TranName']]
        full_data[consts['FIELDS']['TranDesc']] = data[consts['FIELDS']['TranDesc']]
        full_data[consts['FIELDS']['Date']] = data[consts['FIELDS']['Date']]
        full_data[consts['FIELDS']['Amount']] = data[consts['FIELDS']['Amount']]
        full_data[consts['FIELDS']['AccName']] = data[consts['FIELDS']['AccName']]
        full_data[consts['FIELDS']['tableName']] = data[consts['FIELDS']['tableName']]
    return full_data


class create_API(http.server.BaseHTTPRequestHandler):
    def do_POST(self):
        """
        This method is called whenever there is a post action 
        performed in the front end in the port 8000
        """
        if self.path == consts['SERVER']['create_path']:
            data = read_data(self)
            response_data = {}
            print(data)
            if data[consts['FIELDS']['tableName']] == consts['MYSQL']['AM_table']:
                result = data_layer.retrieve_record(data[consts['FIELDS']['tableName']],(data[consts['FIELDS']['AccName']],))
                if result is None:
                    params = (data[consts['FIELDS']['AccName']], data[consts['FIELDS']['AccDesc']], data[consts['FIELDS']['CategoryType']])
                    data_layer.create_record(consts['MYSQL']['AM_table'], params)
                    response_data[consts['FIELDS']['message']] =  consts['MESSAGES']['new_record']
                else:
                    response_data[consts['FIELDS']['message']] = consts['MESSAGES']['record_exists']

            elif data[consts['FIELDS']['tableName']] == consts['MYSQL']['T_table']:
                params = (data[consts['FIELDS']['TranName']],data[consts['FIELDS']['TranDesc']],data[consts['FIELDS']['Date']], data[consts['FIELDS']['Amount']], data[consts['FIELDS']['AccName']])
                data_layer.create_record(consts['MYSQL']['T_table'], params)
                response_data[consts['FIELDS']['message']] = consts['MESSAGES']['new_record']
        
            print(response_data)
            self.send_response(200)
            self.send_header(consts['CORS']['allow_cors'], consts['SERVER']['url']+consts['SERVER']['port_frontend']) #pylint: disable=line-too-long
            self.send_header(consts['CORS']['allow_headers'], '*')
            self.send_header(consts['HEADER']['content_type'], consts['HEADER']['sending_type'])
            self.end_headers()
            self.wfile.write(json.dumps(response_data).encode())

    def do_OPTIONS(self):
        """Handle preflight CORS requests"""
        self.send_response(204)  # No Content
        self.send_header(consts['CORS']['allow_cors'], consts['SERVER']['url']+consts['SERVER']['port_frontend']) #pylint: disable=line-too-long
        self.send_header(consts['CORS']['allow_methods'], consts['SERVER']['post_options'])
        self.send_header(consts['CORS']['allow_headers'], '*')
        self.end_headers()

def run_create(server_class = http.server.HTTPServer, handler_class = create_API):
    """This function creates an HTTP server instance bound to local host
        and port 8000, and starts it to listen for incoming requests indefinitely.
    
    Args:
        server_class (HTTPServer) - to create an instance of this class
        handler_class (BaseHTTPRequestHandler) - to handle incoming HTTP requests
    """
    server_address = (consts['SERVER']['host'], int(consts['SERVER']['port_create']))
    httpd = server_class(server_address, handler_class) #HTTP server instance
    httpd.serve_forever()