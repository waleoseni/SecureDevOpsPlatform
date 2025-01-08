targetScope = 'resourceGroup'

@description('The name of the Log Analytics workspace')
param logAnalyticsName string

@description('The location for the Log Analytics workspace')
param location string

@description('The SKU for the Log Analytics workspace')
param sku string

@description('The SKU for the Log Analytics workspace')
param retentionDays int

@description('KQL query for Azure Diagnostics')
param DashboardKqlQuery string = '''
AzureDiagnostics
| where ResourceType == "AzurePipelines" 
| summarize count() by ResultDescription
'''

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

resource pipelineLogsQuery 'Microsoft.OperationalInsights/workspaces/savedSearches@2023-09-01' = {
  parent: logAnalyticsWorkspace
  name: 'pipelineLogsQuery'
  properties: {
    category: 'Pipeline Logs Query'
    displayName: 'DevOps Pipelines Logs'
    query: 'AzureDiagnostics | where ResourceType == "AzurePipelines" | summarize count() by ResultDescription'
  }
  dependsOn: []
}

resource AzureDashboard 'Microsoft.OperationalInsights/workspaces/savedSearches@2023-09-01' = {
  parent: logAnalyticsWorkspace
  name: 'AzureDashboard'
  properties: {
    category: 'Azure Dashboard Query'
    displayName: 'DevOps Logs Dashboard'
    query: DashboardKqlQuery
  }
  dependsOn: []
}
