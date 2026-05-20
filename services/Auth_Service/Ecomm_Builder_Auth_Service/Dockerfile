# STAGE 1: Compilation Environment (Using heavy .NET 10 SDK)
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy the project blueprint and restore NuGet dependencies
COPY ["Ecomm_Builder_Auth_Service.csproj", "./"]
RUN dotnet restore "Ecomm_Builder_Auth_Service.csproj"

# Pull in your C# source files and build the app assemblies
COPY . .
RUN dotnet build "Ecomm_Builder_Auth_Service.csproj" -c Release -o /app/build

# STAGE 2: Packaging Environment
FROM build AS publish
RUN dotnet publish "Ecomm_Builder_Auth_Service.csproj" -c Release -o /app/publish /p:UseAppHost=false

# STAGE 3: Final Production Execution Environment (Using light Runtime)
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

# Copy purely the optimized build artifacts from the packaging stage
COPY --from=publish /app/publish .

# .NET 10 containers default internally to port 8080
EXPOSE 8080

# Bootstrap your ASP.NET Web API executable
ENTRYPOINT ["dotnet", "Ecomm_Builder_Auth_Service.dll"]