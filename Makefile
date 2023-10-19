PROD_COMPOSE_FILE	=	docker-compose.yml

DOCKER		=	docker compose
OPTIONS		=	#-d

_RESET		=	\e[0m
_RED			=	\e[31m
_GREEN		=	\e[32m
_YELLOW		=	\e[33m
_CYAN			=	\e[36m

all: prod

prod:
	$(DOCKER) -f $(PROD_COMPOSE_FILE) up --build $(OPTIONS)

clean:
	$(DOCKER) -f $(PROD_COMPOSE_FILE) down

fclean: clean
	$(DOCKER) -f $(PROD_COMPOSE_FILE) down --rmi all --volumes --remove-orphans

clean-docker:
	docker system prune
	docker volume prune

mclean: fclean clean-docker

re: fclean all

.PHONY: dev prod front back clean fclean clean-docker mclean