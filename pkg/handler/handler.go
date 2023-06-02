package handler

import (
	"backend_ajax-people/pkg/service"
	"github.com/gin-gonic/gin"
	"github.com/mandrigin/gin-spa/spa"
)

type Handler struct {
	services *service.Service
}

func NewHandler(services *service.Service) *Handler {
	return &Handler{services: services}
}

func (h *Handler) InitRoutes() *gin.Engine {
	router := gin.New()

	router.POST("/sign-up", h.signUp)

	router.POST("/sign-in", h.signIn)

	router.POST("/sign-out", h.signOut)

	router.POST("/test", h.test)

	activation := router.Group("/activation")
	{
		activation.PUT("/check/:id", h.checkActivationUser)
	}
	//apiPublic := router.Group("/api", h.userIdentify)
	apiPublic := router.Group("/api")
	{
		//users := apiPublic.Group("/users", h.userIdentifyById)
		users := apiPublic.Group("/users")
		{
			users.GET("/:id", h.getUserById)

			users.PUT("/:id", h.updateUser)

			users.GET("/", h.selectUsers)

			users.GET("/get-id", h.getId)

			rating := users.Group("/rating")
			{
				rating.PUT("/:id", h.evaluation)

				rating.GET("/:id", h.getRating)
			}

		}

		avatars := apiPublic.Group("/avatar")
		{
			avatars.POST("/upload", h.uploadAvatar)
			avatars.GET("/:id", h.getAvatar)
		}
		coincidence := apiPublic.Group("/coincidence")
		{
			coincidence.POST("/", h.coincidenceSend)
			coincidence.PUT("/:id", h.coincidenceAccept)
		}

		registerData := apiPublic.Group("/register-data")
		{
			registerData.GET("/faculties", h.getAllFaculties)

			registerData.GET("/interests", h.getAllInterests)

			registerData.GET("/user-statuses", h.getAllStatuses)

			registerData.GET("/education-levels", h.getAllEdLevels)

			registerData.GET("/schools", h.getAllSchools)
		}

		posts := apiPublic.Group("/posts")
		{
			posts.GET("/:id", h.getPostById)

			posts.GET("/", h.getPostsByPage)

			posts.POST("/", h.createPost)
		}

		tags := apiPublic.Group("/tags")
		{
			tags.GET("/:id", h.getTagById)

			tags.GET("/", h.getAllTags)
		}

	}

	apiPrivate := router.Group("/api-private", h.userIdentifyAdmin)
	{
		users := apiPrivate.Group("/users")
		{
			users.PUT("/:id", h.changeUserOnAdmin)

			users.DELETE("/:id", h.deleteUser)
		}
		tags := apiPrivate.Group("/tags")
		{
			tags.POST("/", h.createTag)

			tags.DELETE("/:id", h.deleteTag)
		}
		posts := apiPrivate.Group("/posts")
		{
			posts.GET("/", h.getPostsNoModer)

			posts.PUT("/:id", h.updatePost)

			posts.DELETE("/:id", h.deletePost)
		}
	}

	router.Use(spa.Middleware("/", "./client/dist/fefu-meeting-service-frontend"))

	return router
}
