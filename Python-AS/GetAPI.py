import json
import configparser
import http.server
import data_layer

consts = configparser.RawConfigParser()
consts.read('constants.ini')

class Get_API(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == consts['SERVER']['get_accounts_path']:
            accounts_list = data_layer.get_accountsList()
            accounts = [i[0] for i in accounts_list]
            self.send_response(200)
            self.send_header(consts['CORS']['allow_cors'], consts['SERVER']['url']+consts['SERVER']['port_frontend']) #pylint: disable=line-too-long
            self.send_header(consts['CORS']['allow_headers'], '*')
            self.send_header(consts['HEADER']['content_type'], consts['HEADER']['sending_type'])
            self.end_headers()
            self.wfile.write(json.dumps(accounts).encode())

    def do_OPTIONS(self):
        """Handle preflight CORS requests"""
        self.send_response(204)  # No Content
        self.send_header(consts['CORS']['allow_cors'], consts['SERVER']['url']+consts['SERVER']['port_frontend']) #pylint: disable=line-too-long
        self.send_header(consts['CORS']['allow_methods'], consts['SERVER']['post_options'])
        self.send_header(consts['CORS']['allow_headers'], '*')
        self.end_headers()

def run_getaccounts(server_class = http.server.HTTPServer, handler_class = Get_API):
    """This function creates an HTTP server instance bound to local host
        and port 8004, and starts it to listen for incoming requests indefinitely.
    
    Args:
        server_class (HTTPServer) - to create an instance of this class
        handler_class (BaseHTTPRequestHandler) - to handle incoming HTTP requests
    """
    server_address = (consts['SERVER']['host'], int(consts['SERVER']['port_get']))
    httpd = server_class(server_address, handler_class) #HTTP server instance
    httpd.serve_forever()
