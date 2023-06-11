## Process Chain
Process chain dynamically creates an airflow dag with the implementation of hop pipeline execution and druid data injection.

Endpoint:
1. Create Process Chain:
   ```
       POST: /api/airflow/
      
       Payload: {
           "dag_name": "covid-dag-pipeline",
           "dag_id": "covid-dag-pipeline",
           "schedule_interval": "@daily",
           "path": "/covid/Covid.hpl",
           "parquet_path": "/opt/shared/covid/covid.parquet",
           "data_source_name": "covid-data"
       }
   ```
2. Get One Process Chain:
   ```
       GET: /api/airflow/:id
   ```
3. Get All Process Chain:
   ```
       GET: /api/airflow/
   ```
4. Edit Process Chain:
   ```
       POST: /api/airflow/
      
       Payload: {
           "id": "cdddca96-0f5c-4cce-9d6b-6e267eb50ae8",
           "dag_name": "covid-dag-pipeline",
           "dag_id": "covid-dag-pipeline",
           "schedule_interval": "@daily",
           "path": "/covid/Covid.hpl",
           "parquet_path": "/opt/shared/covid/covid.parquet",
           "data_source_name": "covid-data"
       }
   ```
5. Delete One Process Chain:
   ```
       DELETE: /api/airflow/:id
   ```
