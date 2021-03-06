var request = require('superagent');
var fs = require('fs');
var cityConfig = ['wuhu', 'shanghai', 'beijing', 'hangzhou', 'nanjing', 'wuxi', 'xiamen', 'longyan'];
var cheerio = require('cheerio');
var url = 'http://woeid.rosselliot.co.nz/lookup/';
var attrNames = ['city', 'province', 'country', 'woeid'];
var result = [];

cityConfig.forEach(function(city) {
	request.get(url + city)
	.end(function(err, res) {
		$ = cheerio.load(res.text);
		$('#woeid_results_table tr').each(function(i, ele) {
				var obj = {};
				$ = cheerio.load(ele);
				$('td').each(function(index, td) {
					obj[attrNames[index]] = $(this).text();
				})
				result.push(obj);
		});
		var isEmpty = function(object) {
			for (var key in object) {
				return false;
			}
			return true;
		}
		result = result.filter(function(obj) {
			return obj.country === 'China' && !isEmpty(obj);
		})
		fs.writeFile('result.json', JSON.stringify(result, null, "\t"));
	})
});