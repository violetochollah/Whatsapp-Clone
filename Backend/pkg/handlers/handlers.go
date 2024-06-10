package handlers

import (
    "net/http"
    "path/filepath"
    "whatsapp-clone/pkg/websocket"
    "whatsapp-clone/pkg/models"
    "github.com/gin-gonic/gin"
)

var messages []models.Message

func PostMessage(c *gin.Context) {
    var message models.Message
    if err := c.ShouldBindJSON(&message); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    messages = append(messages, message)
    websocket.HubInstance.Broadcast <- []byte(message.Text)
    c.JSON(http.StatusCreated, message)
}

func UploadFile(c *gin.Context) {
    file, err := c.FormFile("file")
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    filename := filepath.Base(file.Filename)
    if err := c.SaveUploadedFile(file, filepath.Join("./uploads", filename)); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"filename": filename})
}

func ServeWs(c *gin.Context) {
    websocket.ServeWs(c.Writer, c.Request)
}
