FROM ruby:3.0

# Set the working directory
WORKDIR /var/www/msgenetics

# Install dependencies
RUN apt-get update && \
    apt-get install -y \
    build-essential \
    nodejs \
    libpq-dev \
    postgresql-client && \
    rm -rf /var/lib/apt/lists/*

# Install gems
COPY Gemfile Gemfile.lock ./
RUN gem install bundler --version 2.5.10 && \
    bundle _2.5.10_ install

# Copy the application code
COPY . .
ARG MSGENETICS_DB_USER
ARG MSGENETICS_DB_PASS
ARG MSGENETICS_DB
RUN bin/rails assets:precompile
# Expose ports
EXPOSE 4444

# Set the entrypoint command
#CMD ["sh", "-c", "rails server -b 0.0.0.0"]