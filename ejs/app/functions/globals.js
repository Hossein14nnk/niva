import _ from "lodash";

// modes: development / production
let mode = "development";

let globals = {
	_: _,
	pathPages: "../../..",
	pathComponents: "./",
	basePath: function () {
		switch (mode) {
			case "production":
				return "../";

			case "development":
				return "../../../";
		}
	},
	navigation: function (lang, file) {
		switch (mode) {
			case "production":
				return "./pages/"+file;
			case "development":
				return "./output/"+lang+"/pages/"+file;;
		}
	},
};

export default globals;
