class groovyFile {
	constructor(sourceCatalog, customerId)
	{
		this.sourceCatalog = sourceCatalog;
		this.customerId = customerId;
		this.fileName = customerId + ".groovy";
		this.folder = sourceCatalog;
		this.contents = new contents(sourceCatalog, customerId);
	}

	toGroovy() {
		//Convert this object to JSON.
		var outputString = JSON.stringify(this.contents, null, ' ');
		//Convert JSON to Groovy script.
		//This is hackish but works well - simply delete JSON's curly braces
		//and double quotes.
		const regex = /{|}|"/g;
		return '[' + outputString.replace(regex,'')  + ']'
	}
}

class contents {
	constructor(sourceCatalog, subscriberId) {
		//Syndication array, which really only contains one anonymous object
		this.syndication = [ { 
			//Wrap everything in single quotes
			//so it survives the object-JSON-groovy transition
			targetCatalog: "'" + sourceCatalog + '-' + subscriberId + "'",
			targetSupplier: "'" + sourceCatalog.split("-")[0] + "'",
			targetContract: "'" + sourceCatalog + '-' + subscriberId + "'",
		} ];
		//Subscription array, which will contain 1+ anonymous objects
		this.subscription = [];
	}
}

class subscriptionProperty {
	constructor(sourceCatalog)
	{
		this.sourceCatalog = sourceCatalog;
		this.customers = [];
	}

	toString() {
		return this.sourceCatalog + "=" + this.customers.join();
	}

}