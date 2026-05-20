# STAGE 1: Compilation Environment
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy project definition and trigger package restoration
COPY ["Ecomm_Builder_Products_Service.csproj", "./"]
RUN dotnet restore "Ecomm_Builder_Products_Service.csproj"

# Build the source logic
COPY . .
RUN dotnet build "Ecomm_Builder_Products_Service.csproj" -c Release -o /app/build

# STAGE 2: Packaging Environment
FROM build AS publish
RUN dotnet publish "Ecomm_Builder_Products_Service.csproj" -c Release -o /app/publish /p:UseAppHost=false

# STAGE 3: Runtime Execution Environment
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

EXPOSE 8080
ENTRYPOINT ["dotnet", "Ecomm_Builder_Products_Service.dll"]