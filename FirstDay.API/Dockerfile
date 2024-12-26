FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy everything and restore as distinct layers
COPY ["FirstDay.API/FirstDay.API.csproj", "FirstDay.API/"]
RUN dotnet restore "FirstDay.API/FirstDay.API.csproj"
COPY . .

# Build and publish a release
WORKDIR "/src/FirstDay.API"
RUN dotnet build "FirstDay.API.csproj" -c Release -o /app/build
RUN dotnet publish "FirstDay.API.csproj" -c Release -o /app/publish

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "FirstDay.API.dll"]