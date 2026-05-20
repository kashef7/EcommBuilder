pipeline {
    agent any
    
    environment {
        // 1. Database Port Mappings - Set to empty string for secure Linux VM hosting
        DB_PORT_MAPPING_AUTH     = ""
        DB_PORT_MAPPING_PRODUCTS = ""
        DB_PORT_MAPPING_SHOP     = ""
        DB_PORT_MAPPING_ORDER    = ""

        // 2. Database Names
        AUTH_DB_NAME             = "AuthDatabase"
        PRODUCTS_DB_NAME         = "ProductsDatabase"
        SHOP_DB_NAME             = "ShopDatabase"
        ORDER_DB_NAME            = "OrderingDatabase"

        // 3. Inject Production Database Credentials from Jenkins Security Vault
        AUTH_DB_USER             = credentials('prod-auth-db-user')
        AUTH_DB_PASSWORD         = credentials('prod-auth-db-password')
        
        PRODUCTS_DB_USER         = credentials('prod-products-db-user')
        PRODUCTS_DB_PASSWORD     = credentials('prod-products-db-password')
        
        SHOP_DB_USER             = credentials('prod-shop-db-user')
        SHOP_DB_PASSWORD         = credentials('prod-shop-db-password')
        
        ORDER_DB_USER            = credentials('prod-ordering-db-user')
        ORDER_DB_PASSWORD        = credentials('prod-ordering-db-password')
    }

    stages {
        stage('Pull Changes') {
            steps {
                echo 'Pulling latest commit from GitHub Repo...'
                // Jenkins automatically checks out your repository code here
            }
        }

        stage('Build & Deploy Architecture') {
            steps {
                echo 'Executing Zero-Downtime Rebuild & Hot-Swap via Docker Compose...'
                // Rebuilds only modified service layers and swaps containers seamlessly
                sh 'docker-compose up -d --build'
            }
        }

        stage('DevOps Housekeeping') {
            steps {
                echo 'Pruning orphaned image layers to optimize local Linux VM disk space...'
                // Safely drops dangling container layers left behind by builds
                sh 'docker image prune -f'
            }
        }
    }
}