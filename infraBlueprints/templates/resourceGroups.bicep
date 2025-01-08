targetScope='subscription'

@description('Array of resource group names to create')
param resourceGroupName string

@description('Location for the resource groups')
param location string

@description('Deploy New Resource Groups')
resource ResourceGroup 'Microsoft.Resources/resourceGroups@2024-03-01' = {
  name: resourceGroupName
  location: location
  }

