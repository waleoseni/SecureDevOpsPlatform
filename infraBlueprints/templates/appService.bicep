targetScope = 'resourceGroup'

@description('Name of the hosting plan (App Service Plan).')
param appServicePlanName string

@description('Name of the Web App.')
param appServiceName string

@description('Location of the Resource Group.')
param location string

@description('Enable Always On.')
param alwaysOn bool

@description('FTPS state.')
param ftpsState string

@description('App Service SKU tier.')
param skuTier string

@description('App Service SKU code.')
param skuName string

@description('Worker size ID.')
param targetWorkerSizeId int

@description('Number of workers (horizontal scaling).')
param targetWorkerCount int

@description('Runtime version to use on Linux.')
param linuxFxVersion string

// App Service Plan (Server Farm)
@description('Deploy App Service Plan (Server Farm)')
resource appServicePlan 'Microsoft.Web/serverfarms@2024-04-01' = {
  name: appServicePlanName
  location: location
  kind: 'linux'
  properties: {
    targetWorkerSizeId: targetWorkerSizeId
    targetWorkerCount: targetWorkerCount
    reserved: true
    zoneRedundant: false
  }
  sku: {
    tier: skuTier
    name: skuName
  }
}


// Web App
@description('Deploy Web App')
resource webApp 'Microsoft.Web/sites@2024-04-01' = {
  name: appServiceName
  location: location
  properties: {
    siteConfig: {
      appSettings: []
      linuxFxVersion: linuxFxVersion
      alwaysOn: alwaysOn
      ftpsState: ftpsState
    }
    serverFarmId: appServicePlan.id
    clientAffinityEnabled: false
    httpsOnly: true
    publicNetworkAccess: 'Enabled'
  }
  identity: {
    type: 'SystemAssigned'
  }
  dependsOn: []
}
