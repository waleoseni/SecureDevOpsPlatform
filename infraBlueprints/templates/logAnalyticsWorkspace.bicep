targetScope = 'resourceGroup'

@description('The name of the Log Analytics workspace')
param logAnalyticsName string

@description('The location for the Log Analytics workspace')
param location string

@description('The SKU for the Log Analytics workspace')
param sku string

@description('The SKU for the Log Analytics workspace')
param retentionDays int

@description('Deploy Log Analytics workspace')
resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: logAnalyticsName
  location: location
  properties: {
    sku: {
      name: sku
    }
  retentionInDays: retentionDays
  }
  dependsOn: []
}

