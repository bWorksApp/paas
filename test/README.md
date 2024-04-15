## Access Token
git clone https://github.com/bWorksApp/paas
cd paas/test
jmeter -n -t accesstoken.jmx -l accesstoken.jtl

If you don't see Access Token in accesstoken.jtl file, add the next lines to user.properties file in JMETER's bin folder
jmeter.save.saveservice.output_format=xml
jmeter.save.saveservice.response_data=true
jmeter.save.saveservice.samplerData=true
jmeter.save.saveservice.requestHeaders=true
jmeter.save.saveservice.url=true
jmeter.save.saveservice.responseHeaders=true

## API Get users
Get access token and update value at line 38 in getusers.jmx file 
git clone https://github.com/bWorksApp/paas
cd paas/test
jmeter -n -t getusers.jmx -l getusers.jtl