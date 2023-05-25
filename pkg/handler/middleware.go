package handler

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

const (
	authorizationHeader = "Authorization"
	userCtx             = "userId"
)

func checkAdmin(h *Handler, c *gin.Context) bool {
	token, err := c.Cookie("jwtToken")
	if err != nil {
		return false
	}

	_, isAdmin, _, err := h.services.ParseToken(token)
	if err != nil {
		return false
	}

	return isAdmin
}

func getJWT(h *Handler, c *gin.Context) (int, bool, bool, error) {
	token, err := c.Cookie("jwtToken")
	if err != nil {
		return 0, false, false, err
	}

	userId, isAdmin, isVerificated, err := h.services.ParseToken(token)
	if err != nil {
		return 0, false, false, err
	}

	return userId, isAdmin, isVerificated, nil
}

func (h *Handler) userIdentify(c *gin.Context) {
	_, _, isVerificated, err := getJWT(h, c)
	if err != nil {
		newErrorResponse(c, http.StatusUnauthorized, "Unauthorized")
		return
	}
	if !isVerificated {
		newErrorResponse(c, http.StatusUnauthorized, "Your account is not verified")
	}
}

func (h *Handler) userIdentifyById(c *gin.Context) {
	userId, _, _, _ := getJWT(h, c)
	getId, err := getUserId(c)
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
	}
	if userId != getId {
		if getId == 0 {
			return
		}
		newErrorResponse(c, http.StatusForbidden, "Forbidden")
		return
	}

}

func (h *Handler) userIdentifyAdmin(c *gin.Context) {
	if checkAdmin(h, c) == false {
		newErrorResponse(c, http.StatusForbidden, "Forbidden")
		return
	}
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {

		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Header("Access-Control-Allow-Methods", "POST,HEAD,PATCH, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func getUserId(c *gin.Context) (int, error) {

	str := c.Param("id")
	fmt.Println(str)

	if str == "" {
		return 0, nil
	}
	id, err := strconv.Atoi(str)
	if err != nil {
		panic(err)
	}

	return id, nil
}
