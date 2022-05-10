package main

import (
	"crypto/ecdsa"
	"fmt"
	"log"
	"os"

	//"github.com/joho/godotenv"

	"github.com/sideshow/apns2"
	"github.com/sideshow/apns2/token"
)

var authKey *ecdsa.PrivateKey
var authToken *token.Token
var client *apns2.Client

func init() {
	/*
		err := godotenv.Load(".env")

		if err != nil {
			log.Fatal("Error loading .env file")
		}
	*/

	if os.Getenv("KEY_ID") == "" {
		log.Fatal("Missing KeyID [KEY_ID]")
	}
	if os.Getenv("TEAM_ID") == "" {
		log.Fatal("Missing Team ID [TEAM_ID]")
	}
	if os.Getenv("DEVICE_TOKEN") == "" {
		log.Fatal("Missing Device Token [DEVICE_TOKEN]")
	}

	var tempKey, err = token.AuthKeyFromFile(fmt.Sprintf("./AuthKey_%s.p8", os.Getenv("KEY_ID")))
	if err != nil {
		log.Fatal("Error loading AuthKey file", err)
	}
	authKey = tempKey

	authToken = &token.Token{
		AuthKey: authKey,
		// KeyID from developer account (Certificates, Identifiers & Profiles -> Keys)
		KeyID: os.Getenv("KEY_ID"),
		// TeamID from developer account (View Account -> Membership)
		TeamID: os.Getenv("TEAM_ID"),
	}

	client = apns2.NewTokenClient(authToken)

	fmt.Println("Created Client")
}

func sendPushNotification(text string) {
	/*
		envs, err_envs := godotenv.Read(".env")
		if err_envs != nil {
			log.Fatal("Error loading .env file")
		}
	*/

	notification := &apns2.Notification{}
	notification.DeviceToken = os.Getenv("DEVICE_TOKEN")
	notification.Topic = os.Getenv("TOPIC")
	notification.Payload = []byte(fmt.Sprintf(`{"aps":{"alert":"%s"}}`, text)) // See Payload section below

	// If you want to test push notifications for builds running directly from XCode (Development), use
	// client := apns2.NewClient(cert).Development()
	// For apps published to the app store or installed as an ad-hoc distribution use Production()

	res, err := client.Push(notification)
	_ = res

	if err != nil {
		log.Fatal("Error:", err)
	}

	//fmt.Printf("%v %v %v\n", res.StatusCode, res.ApnsID, res.Reason)
}
