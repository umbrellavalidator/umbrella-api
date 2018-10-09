package main

import (
        "net/http"
		"html/template"
        "google.golang.org/appengine" // Required external App Engine library
)

var (
        indexTemplate = template.Must(template.ParseFiles("index.html"))
        LatestNotice = "No notice yet"
)

type templateParams struct {
        Notice string
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
        // if statement redirects all invalid URLs to the root homepage.
        // Ex: if URL is http://[YOUR_PROJECT_ID].appspot.com/FOO, it will be
        // redirected to http://[YOUR_PROJECT_ID].appspot.com.
        if r.URL.Path != "/" {
                http.Redirect(w, r, "/", http.StatusFound)
                return
        }

	// [START handling]
	params := templateParams{}

	if r.Method == "GET" {
		indexTemplate.Execute(w, params)
		return
	}

	// It's a POST request, so handle the form submission.

	LatestNotice = r.FormValue("notice") 
	params.Notice = LatestNotice

	// TODO: save the message into a database.

	// params.Notice = fmt.Sprintf("Thank you for your submission, %s!", name)
	// [END handling]
	// [START execute]
	indexTemplate.Execute(w, params)
	// [END execute]


}

func main() {
        http.HandleFunc("/", indexHandler)
        appengine.Main() // Starts the server to receive requests
}
