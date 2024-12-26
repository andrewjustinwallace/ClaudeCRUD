FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy everything and restore as distinct layers
COPY ["FirstDay.Admin.API/FirstDay.Admin.API.csproj", "FirstDay.Admin.API/"]
RUN dotnet restore "FirstDay.Admin.API/FirstDay.Admin.API.csproj"
COPY . .

# Build and publish a release
WORKDIR "/src/FirstDay.Admin.API"
RUN dotnet build "FirstDay.Admin.API.csproj" -c Release -o /app/build
RUN dotnet publish "FirstDay.Admin.API.csproj" -c Release -o /app/publish

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "FirstDay.Admin.API.dll"]