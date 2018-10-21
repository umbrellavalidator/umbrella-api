package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"
	"strings"
	"github.com/tidwall/gjson"
	"bytes"
	"strconv"
)

func main() {
	sentryUrl := "http://188.166.197.222:26657/consensus_state"
	serverUrl := "http://localhost:8080"
	valAddr := "7EB7593F519F"

	latestBlockHeight := 0


	jsonByte := getJsonByte(sentryUrl)
	latestBlockHeight = getBlockHeight(jsonByte)

	for { // Infinite loop
		jsonByte = getJsonByte(sentryUrl)
		currentHeight := getBlockHeight(jsonByte)
		time.Sleep(300 * time.Millisecond) //This can be lower when we change the program to pull from db instead of http request
		signedStatus := getSignedStatus(jsonByte, valAddr)
		
		if signedStatus && currentHeight > latestBlockHeight{
			if currentHeight - latestBlockHeight > 1 {
				fmt.Println("Missed a block? Could be not checking often enough")
			}
			latestBlockHeight = currentHeight
			fmt.Println("Block Height: ", currentHeight, signedStatus)
		}

		
	}


	var jsonStr = []byte(`{"notice":"Buy cheese and bread for breakfast."}`)
	sendPost(serverUrl, jsonStr)
}

// Sends a Http post with json byte array to url specified
func sendPost (url string, jsonByte []byte) {
    req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonByte))
    req.Header.Set("X-Custom-Header", "myvalue")
    req.Header.Set("Content-Type", "application/json")

    client := &http.Client{
		Timeout: time.Second * 2, // Maximum of 2 secs
    }
    resp, err := client.Do(req)
    if err != nil {
        log.Fatal(err)
    }
    defer resp.Body.Close()

    fmt.Println("response Status:", resp.Status)
    fmt.Println("response Headers:", resp.Header)
    body, _ := ioutil.ReadAll(resp.Body)
    fmt.Println("response Body:", string(body))
}

// gets the block height from the consensus_state json byte array
func getBlockHeight (jsonByte []byte) int {
	blockHeightString := gjson.GetBytes(jsonByte, "result.round_state.height/round/step")
	height := strings.Split(fmt.Sprintf("%s", blockHeightString), "/")[0] 
	i, err := strconv.Atoi(height)
	if err != nil {
   		log.Fatal(err)
	}
	return i
}

// gets the signed status by searching address string
func getSignedStatus (jsonByte []byte, addressString string) bool {
	containsAddress := false
	precommits := gjson.GetBytes(jsonByte, "result.round_state.height_vote_set.0.precommits")
	precommits.ForEach(func(key, value gjson.Result) bool {
		if strings.Contains(value.String(), addressString) {
			containsAddress = true
		}
		return true
	})
	return containsAddress
}

//Pulls a Json given a url where the json is stored. Can be localhost?
func getJsonByte (url string) []byte {
	jsonClient := http.Client{
		Timeout: time.Second * 2, // Maximum of 2 secs
	}

	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		log.Fatal(err)
	}

	req.Header.Set("User-Agent", "umbrella client")

	res, getErr := jsonClient.Do(req)
	if getErr != nil {
		log.Fatal(getErr)
	}

	body, readErr := ioutil.ReadAll(res.Body)
	if readErr != nil {
		log.Fatal(readErr)
	}

	return body
	//jsonErr := json.Unmarshal(body, jsonBody)
//
//	if jsonErr != nil {
//		log.Fatal(jsonErr)
//	}
}