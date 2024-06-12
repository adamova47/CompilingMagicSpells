FROM node:22-alpine AS web-build

WORKDIR /build

COPY frontend/NgWizardsWorkspace NgWizardsWorkspace/

COPY frontend/NgWizardsWorkspace/package.json frontend/NgWizardsWorkspace/package-lock.json ./
RUN npm install

COPY frontend/NgWizardsWorkspace .
RUN npm run build --prod

FROM nginx:1.27-alpine AS ng

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=web-build /build/NgWizardsWorkspace/dist/ng-wizards-workspace/browser /usr/share/nginx/html

FROM python:3.12-slim-bookworm AS api

ARG POETRY_INSTALL_ARGS=""

WORKDIR /app
RUN useradd -ms /bin/bash appuser

ENV PYTHONUNBUFFERED 1
ENV PYTHONFAULTHANDLER 1
ENV PATH=/home/appuser/.local/bin:$PATH
ENV IS_DOCKER=1

RUN export DEBIAN_FRONTEND=noninteractive \
    && apt update \
    && apt install -y caddy xz-utils \
    && apt -y upgrade \
    && apt -y clean \
    && rm -rf /var/lib/apt/lists/*
    
ARG MULTIRUN_VERSION=1.1.3
ADD https://github.com/nicolas-van/multirun/releases/download/${MULTIRUN_VERSION}/multirun-x86_64-linux-gnu-${MULTIRUN_VERSION}.tar.gz /tmp
RUN tar -xf /tmp/multirun-x86_64-linux-gnu-${MULTIRUN_VERSION}.tar.gz \
    && mv multirun /bin \
    && rm /tmp/*
    
RUN chown appuser:appuser /app

USER appuser

RUN pip install --upgrade pipenv
COPY backend/EndpointEnchantersWorkspace/Pipfile backend/EndpointEnchantersWorkspace/Pipfile.lock ./
RUN pipenv install --system --dev --deploy

COPY backend/EndpointEnchantersWorkspace EndpointEnchantersWorkspace/

COPY docker/start.sh /app/start.sh
COPY docker/Caddyfile /app/Caddyfile

WORKDIR /app/EndpointEnchantersWorkspace
RUN python manage.py collectstatic --no-input
CMD ["/bin/multirun", "caddy run --adapter caddyfile --config /app/Caddyfile", "/app/start.sh"]