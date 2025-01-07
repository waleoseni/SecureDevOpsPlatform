# Secure DevOps Platform

## Introduction
This repository contains the source code, configurations, and documentation for the dissertation:  
**"Next-Generation Platform Engineering for DevOps: Securing and Scaling Continuous Integration and Continuous Deployment (CI/CD) Pipelines in a Dynamic Environment."**

The artefact focuses on addressing the three critical challenges in CI/CD pipelines:
1. **Security**: Integration of automated tools for real-time vulnerability detection.
2. **Scalability**: Dynamic scaling to handle fluctuating workloads efficiently.
3. **Adaptability**: Modular and declarative pipeline designs for seamless updates.

---

## Repository Structure

The repository is organized into the following folders:

- **`pipelineConfigs/`**: YAML configuration files for each CI/CD pipeline stage.
  - Integration
  - Build and Testing
  - Security Validation
  - Deployment
- **`scripts/`**: Automation scripts for:
  - Security scanning using OWASP ZAP and Dependency-Check.
  - Scaling and performance monitoring.
- **`docs/`**: Documentation, including:
  - Setup instructions.
  - Details on the design and implementation of the pipeline stages.
  - Sample data and test cases.
- **`examples/`**: Sample input and output files for testing and demonstration purposes.

---

## Features

### 1. **Security**
- Integrated **OWASP ZAP** for dynamic vulnerability scanning.
- Added **Dependency-Check** to monitor third-party libraries for known vulnerabilities.
- Compliance-as-Code frameworks to ensure adherence to regulatory standards like GDPR.

### 2. **Scalability**
- Utilized **Azure App Services** with auto-scaling for handling workload surges.
- Implemented task parallelization and build caching to optimize resource usage.

### 3. **Adaptability**
- Modular pipeline architecture for independent updates to stages.
- YAML-based declarative configurations for easy customization and portability.

---

## Installation and Setup

### Prerequisites
- **Azure Account** for deploying pipeline components.
- **Git** for cloning the repository.
- **Python 3.x** (if using custom scripts).
- **Docker** (optional, for containerized builds).

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/waleoseni/SecureDevOpsPlatform.git
   ```
2. Security Scans:
   ```bash
   python scripts/run_security_scans.py
   ```
---

## License

This project is licensed under the [MIT License](LICENSE). You are free to use, modify, and distribute the code with proper attribution.
