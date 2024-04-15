## Get token access
git clone https://github.com/bWorksApp/paas
cd paas/test
jmeter -n -t get-token.jmx -l result.jtl

If you don't see Access Token in result.jtl file, add the next lines to user.properties file in JMETER's bin folder
jmeter.save.saveservice.output_format=xml
jmeter.save.saveservice.response_data=true
jmeter.save.saveservice.samplerData=true
jmeter.save.saveservice.requestHeaders=true
jmeter.save.saveservice.url=true
jmeter.save.saveservice.responseHeaders=true
