package models

type Message struct {
    Username string `json:"username"`
    Text     string `json:"text"`
    File     string `json:"file"`
}
