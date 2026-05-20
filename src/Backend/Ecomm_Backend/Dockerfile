# Stage 1: Build the React Frontend (Node 22)
FROM node:22-alpine AS frontend-builder
WORKDIR /src/Frontend
COPY src/Frontend/Ecomm_Builder_Frontend/package*.json ./
RUN npm ci
COPY src/Frontend/Ecomm_Builder_Frontend ./
RUN npm run build

# Stage 2: Build & Publish the .NET 10 Web API Backend
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS backend-builder
WORKDIR /src/Backend
COPY src/Backend/Ecomm_Backend/*.csproj ./
RUN dotnet restore
COPY src/Backend/Ecomm_Backend/ ./
RUN mkdir -p wwwroot
COPY --from=frontend-builder /src/Frontend/dist/ ./wwwroot/
RUN dotnet publish -c Release -o /app/publish

# Stage 3: High-Performance .NET 10 Runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=backend-builder /app/publish .
ENV ASPNETCORE_URLS=http://+:80
ENV ASPNETCORE_ENVIRONMENT=Production
EXPOSE 80
ENTRYPOINT ["dotnet", "Ecomm_Backend.dll"]
