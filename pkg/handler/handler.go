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

	//Отключение корс
	router.Use(CORSMiddleware())

	/*
		sign-up - Регистрация
		вход: mail(string), password(string)
		выход: id пользователя
		Ошибки: 400 - данные не правильные
			  	500 - Нет доступа к серверу
	*/
	router.POST("/sign-up", h.signUp)

	/*
		sign-in - Авторизация
		вход: mail(string), password(string)
		выход: jwt - токен
		Ошибки: 400 - данные не правильные
				500 - Нет доступа к серверу
	*/
	router.POST("/sign-in", h.signIn)

	/*
		sign-out - Выход
		вход:
		выход: Ok
		Чистит куки от jwt токена
	*/
	router.POST("/sign-out", h.signOut)

	// мой test
	router.POST("/test", h.test)

	activation := router.Group("/activation")
	{
		/*
			check/:id - Верификация пользователя по коду на почту
			вход: параметр - id юзера, json:code - код
			выход: Ok
			Ошибки: 400 - неверные данные либо код не совпадает
					500 - Нет доступа к серверу
		*/
		activation.PUT("/check/:id", h.checkActivationUser)
	}
	//apiPublic := router.Group("/api", h.userIdentify) - ограничения
	apiPublic := router.Group("/api")
	{
		//users := apiPublic.Group("/users", h.userIdentifyById) - ограничения
		users := apiPublic.Group("/users")
		{
			/*
				get - / - Получение всех пользователей
				выход: Все пользователи в структуре User
				Ошибки: 500 - Нет доступа к серверу
			*/
			//users.GET("/", h.getAllUsers) не нужно

			/*
				get - /:id - Получение пользователя по параметру - id
				выход: Пользователь в виде структуры User
				Ошибки: 500 - Нет доступа к серверу
			*/
			//users.GET("/:id", h.getUserById) не нужно

			/*
				put - /:id - Изменение личных данных пользователя по параметру - id
				вход: Данные которые хочет изменит пользователь, Пример - ("age": 19)
				выход: Ok
				Ошибки: 400 - Неверный формат данных
						500 - Нет доступа к серверу
			*/
			users.PUT("/:id", h.updateUser)

			/*
				select - Выборка пользователей по определенным личным данным
				вход: Данные по которым пользователь хочет сделать выброрку, Пример - ("age": 19)
				выход: Пользователи в виде структуры User
				Ошибки: 400 - Неверный формат данных
						500 - Нет доступа к серверу
			*/
			users.GET("/", h.selectUsers)
		}

		/*
			upload - Загрузка фотографии на сервер
			вход: form-data(Фотография по ключом file)
			выход: путь до фотографии
			Ошибки: 400 - Неверный формат данных
					500 - Нет доступа к серверу
		*/
		avatars := apiPublic.Group("/avatar")
		{
			avatars.POST("/upload", h.uploadAvatar)
			avatars.GET("/:id", h.getAvatar)
		}
		coincidence := apiPublic.Group("/coincidence")
		{
			/*
				post - / - Заявка на дружбу(переписку)
				вход: mail(string)
				выход: id (кому кинул заявку)
				Ошибки: 400 - Неверный формат данных или заявка уже отправлена
						500 - Нет доступа к серверу
			*/
			coincidence.POST("/", h.coincidenceSend)

			/*
				put - /:id - Принять запрос на дружбу(переписку)
				вход: в параметре id пользователя чей запрос хочешь принять
				выход: Accept
				Ошибки: 400 - Неправильный параметр
						500 - Нет доступа к серверу
			*/
			coincidence.PUT("/:id", h.coincidenceAccept)
		}

		registerData := apiPublic.Group("/register-data")
		{
			/*
				get - /faculties - Получение списка всех направлений подготовки
				выход: Список факультетов
				Ошибки: 500 - Нет доступа к серверу
			*/
			registerData.GET("/faculties", h.getAllFaculties)

			/*
				get - /interests - Получение списка всех интересов
				выход: Список интересов
				Ошибки: 500 - Нет доступа к серверу
			*/
			registerData.GET("/interests", h.getAllInterests)

			/*
				get - /user-statuses - Получение списка всех возможных состояний Пользователя
				выход: Список всех возможных состояний Пользователя
			*/
			registerData.GET("/user-statuses", h.getAllStatuses)

			/*
				get - /education-levels - Получение списка всех возможных уровней обучения
				выход: Список всех возможных уровней обучения
			*/
			registerData.GET("/education-levels", h.getAllEdLevels)

			/*
				get - /schools - Получение списка всех школ
				выход: Список всех школ
				Ошибки: 500 - Нет доступа к серверу
			*/
			registerData.GET("/schools", h.getAllSchools)
		}

		posts := apiPublic.Group("/posts")
		{
			/*
				get - /:id - Получение поста по id
				выход: Пост
				Ошибки: 400 - Неверный параметр
						500 - Нет доступа к серверу
			*/
			posts.GET("/:id", h.getPostById)

			/*
				get - / - Получение списка постов
				выход: Список постов
				Ошибки: 500 - Нет доступа к серверу
			*/
			posts.GET("/", h.getPostsByPage)

			/*
				post - / - Создание поста
				вход: text(string), tags([]int)
				выход: id поста
				Ошибки: 400 - Неверный формат
						500 - Нет доступа к серверу
			*/
			posts.POST("/", h.createPost)

			/*
				Это потом переедет в api-private
				put - / - Модерирование поста
				вход: параметр id поста, isModerated(bool)
				выход: Ok
				Ошибки: 400 - Неверный формат
						500 - Нет доступа к серверу
			*/
			posts.PUT("/:id", h.updatePost)

			/*
				Это потом переедет в api-private
				delete - / - Удалние поста
				вход: параметр id поста
				выход: Ok
				Ошибки: 400 - Неверный формат
						500 - Нет доступа к серверу
			*/
			posts.DELETE("/:id", h.deletePost)
		}

		tags := apiPublic.Group("/tags")
		{
			/*
				get - /:id - Получение тега по id
				выход: Тег
				Ошибки: 400 - Неверный параметр
						500 - Нет доступа к серверу
			*/
			tags.GET("/:id", h.getTagById)

			/*
				get - / - Получение списка тегов
				выход: Список тегов
				Ошибки: 500 - Нет доступа к серверу
			*/
			tags.GET("/", h.getAllTags)

			/*
				post - / - Создание тега
				вход: title(string)
				выход: id тега
				Ошибки: 400 - Неверный формат
						500 - Нет доступа к серверу
			*/
			tags.POST("/", h.createTag)

			/*
				Это потом переедет в api-private
				delete - / - Удалние тега
				вход: параметр id поста
				выход: Ok
				Ошибки: 400 - Неверный формат
						500 - Нет доступа к серверу
			*/
			tags.DELETE("/:id", h.deleteTag)
		}
	}

	// для этого сделаю позже
	apiPrivate := router.Group("/api-private", h.userIdentifyAdmin)
	{
		users := apiPrivate.Group("/users")
		{
			users.POST("/", h.createUser)
			users.GET("/", h.getAllUsers)
			users.GET("/:id", h.getUserById)
			users.DELETE("/:id", h.deleteUser)
			users.PUT("/:id", h.updateUser)
		}
	}

	router.Use(spa.Middleware("/", "./client/dist/fefu-meeting-service-frontend"))

	return router
}
