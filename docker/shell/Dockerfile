# https://hub.docker.com/_/ubuntu/
FROM ubuntu:18.10

# Locales
ENV LANGUAGE en_US.UTF-8
ENV LANG en_US.UTF-8
RUN apt-get update && \
    apt-get install -y locales && \
    locale-gen en_US.UTF-8

# Colors and italics for tmux
COPY xterm-256color-italic.terminfo /root
RUN tic /root/xterm-256color-italic.terminfo
ENV TERM=xterm-256color-italic

# Common packages
ENV TZ Europe/Stockholm
RUN ln -snf /usr/share/zoneinfo/${TZ} /etc/localtime && echo ${TZ} > /etc/timezone

RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    git \
    iputils-ping \
    jq \
    libncurses5-dev \
    libevent-dev \
    net-tools \
    netcat-openbsd \
    silversearcher-ag \
    socat \
    software-properties-common \
    tmux \
    tzdata \
    wget \
    zsh \
    apt-transport-https \
    ca-certificates
RUN chsh -s /usr/bin/zsh

# Install docker
RUN curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add - && \
    add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" && \
    apt-get update && \
    apt-get install -y docker-ce

ENV COMPOSE_VERSION 1.22.0
RUN curl -o /usr/local/bin/docker-compose -L "https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" && \
    chmod +x /usr/local/bin/docker-compose

# Install tmux
ENV TMUX_VERSION 2.5
WORKDIR /usr/local/src
RUN wget "https://github.com/tmux/tmux/releases/download/${TMUX_VERSION}/tmux-${TMUX_VERSION}.tar.gz"
RUN tar xzvf "tmux-${TMUX_VERSION}.tar.gz"
WORKDIR /usr/local/src/tmux-${TMUX_VERSION}
RUN ./configure
RUN make 
RUN make install
RUN rm -rf /usr/local/src/tmux*

# Install node
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash - && \
    apt-get install -y nodejs

WORKDIR /
