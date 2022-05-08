package main

import (
	"fmt"
	"net/http"
)

func triggerNewCurrent(w http.ResponseWriter, r *http.Request) {
	sendPushNotification("Neuer Vertretungsplan für Heute verfügbar.")
}

func triggerNewNext(w http.ResponseWriter, r *http.Request) {
	sendPushNotification("Neuer Vertretungsplan für morgen verfügbar.")
}

func main() {
	fmt.Println("Server Started")
	http.HandleFunc("/new_current", triggerNewCurrent)
	http.HandleFunc("/new_next", triggerNewNext)
	http.ListenAndServe(":3000", nil)
}
