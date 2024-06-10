package main

import (
    "whatsapp-clone/pkg/handlers"
    "whatsapp-clone/pkg/websocket"
    "github.com/gin-gonic/gin"
)

func main() {
    go websocket.HubInstance.Run()

    router := gin.Default()

    router.GET("/ping", func(c *gin.Context) {
        c.JSON(200, gin.H{
            "message": "pong",
        })
    })

    router.GET("/ws", handlers.ServeWs)
    router.POST("/api/messages", handlers.PostMessage)
    router.POST("/api/upload", handlers.UploadFile)

    router.Run(":8080")
}
