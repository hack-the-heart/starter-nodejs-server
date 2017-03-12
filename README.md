# Starter NodeJS & CloudantDB
The server reads from a CloudantDB and displays all data inside the DB. This is meant to be a starter server to get things started (the method used to display all the data is not efficent for large amounts of data).  

**Cloudant DB**

We are using CloudantDB running on Bluemix for the database. Cloudant is built on CouchDB and comes with its own [REST APIs](https://cloudant.com/product/cloudant-features/restful-api/) to access/add/manipulate data. However, there are third party Cloudant libraries that simplify interactions with the database.

We are using [`swift-cloudant`](https://github.com/cloudant/swift-cloudant) in our iOS project (and [`java-cloudant`](https://github.com/cloudant/java-cloudant) can be used for the android project). 

## Setting Up Your Project
**Install Prerequisites**

- NodeJS: https://nodejs.org/en/download/
- Bluemix Command Line Interface: http://clis.ng.bluemix.net/ui/home.html

**Download Source Code**

1. Download or fork this repository

***

**Bluemix Account Setup**

1. Sign up for a Bluemix account: https://console.ng.bluemix.net/registration/

2. From the [Bluemix Console](https://console.ng.bluemix.net/?direct=classic), click on `Catalog` (in the top Navigation Bar)

3. Click on `Node.js Cloudant DB Web Starter`, Enter your app name, and click on `Create`

4. This will setup your Node JS Server and a instance of Cloudant DB.

***

**Setup Cloudant DB**

1. Go to your [dashboard](https://console.ng.bluemix.net/dashboard/apps/) and click on your Cloudant DB instance, under the `Services` section. 

2. Make a note of your Cloudant DB Instance name, e.g. `starter-app-cloudantNoSQLDB`

3. Select `Service Credentials` from the left navigation pane, and Click on `Add Credentials`.

4. Name your credentials and copy your credentials json to a temporary location. We will need to use this later.

5. Click on the `Manage` tab and then click on `Launch` on the top right corner to launch your Cloudant DB Admin panel. 

6. Create a database called `sensor_data`

7. Select the database and create a `Query Index`. This is located in the dropdown menu under `Design Document` (click the plus icon). Copy and paste the text below and click on `Create Index`. 

```
{
  "index": {
    "fields": [],
     "selector": {},
    "default_analyzer": "keyword",
    "default_field": {},
    "index_array_lengths": true
  },
  "type": "text"
}
  ```
\> [more info](https://docs.cloudant.com/cloudant_query.html) about indexes

***

**NodeJS Server Setup**

There are a few ways to get your codebase setup on Bluemix. We will get you setup using the command line interface. 

1. You will need to configure the source code that you just downloaded:

  1a. Edit the `manifest.yml` file and update the app/host name to your app/host name instance that you created on Bluemix. 
  
  1b. Under services (in the `manifest.yml` file), update the cloudant db name to the name of the Cloudant DB Instance that you created above.
  
  1c. Create a folder called `config` and a file inside that folder called `local-db-info.json`. Edit the json file and add the text below. Make sure to fill in your db credentials json (that you copied earlier). 
```
local-db-info.json unfilled template:
{
  "credentials": {YOUR_CREDENTIALS_JSON_OBJ_HERE},
  "dbname": "sensor_data"
}


local-db-info.json filled in template:
{
	"credentials": {
		"username": "test-bluemix",
		"password": "test",
		"host": "test-bluemix.cloudant.com",
		"port": 443,
		"url": "https://test-bluemix:123@test-bluemix.cloudant.com"
	},
	"dbname": "sensor_data"
}
```
2. Go to your main [dashboard](https://console.ng.bluemix.net/dashboard/apps/) and click on your NodeJS app (under services).

3. In your NodeJS app's dashboard, click on `Start Coding` (on the left navigation pane) and Select `CF - Command Line Interface`. 

4. Follow the steps, starting from step #2 in the `CF - Command Line Interface` guide. Instead of using the source code from step 1, you will use the source code that you just downloaded and modified.

5. You can also run the server locally by starting the server with `npm start`. The database will still be running on Bluemix, but a local instance of the server will allow you to build and deploy much faster since you will not have to wait for your code to be pushed up to Bluemix. 
   5a. To do this, run `npm install` in the directory of your node js project to install all dependencies. Then run `npm start`. As long as you have your db credentials setup, your server should be up and running. You can visit [http://localhost:3000](http://localhost:3000) to confirm.

## Data Format

Use this data format (below) when uploading data. The actual data values go inside the inner dictionary with the key `data`. This is to support multiple data values. For example, blood pressure contains a systolic and a diastolic value. 

`insertionDateInSeconds` is the date the record was inserted. `dateInSeconds` is the date that the value was recorded. For example, the user could have recorded a weight value on Thursday (`dateInSeconds`) but it was uploaded to the server on Friday (`insertionDateInSeconds`).

Data Format:
```
{
  "_id": "4FF1B170-4DE8-488C-AF11-91050B29FD09", //{auto_generated}
  "_rev": "1-f62f97e5a6aa60b9cb831e6c78f3588a", //{auto_generated}
  "dateInSeconds": 1466968380,
  "healthObjType": "Weight",
  "participantId": "1",
  "sessionId": "1",
  "sourceName": "Health",
  "insertionDateInSeconds": 1466970860.109398,
  "data": {
    "value": 133
  }
}
```
