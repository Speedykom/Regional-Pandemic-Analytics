## Motivation

As a Regional Pandemic Analytics tool (RePan), we aim to support various data sources, including loading data from files, APIs, or databases.

Interoperability has become a crucial aspect of health data, given the growing reliance on mobile devices and the increasing need for secure access to health data in recent years. Therefore, we also strive to support systems that adhere to standards such as FHIR (Fast Healthcare Interoperability Resources).


## FHIR Test Server

To test again a FHIR server, the following test server is a goog starting point to get access the different resources and to query them:

http://hapi.fhir.org/baseR4


Resource Support:

As for MVP we first aim to support these FHIR Resources with 3 search parameter each.


1. Patient
    - Id
    - BirthDate 
    - Gender
    - Adress

2. Immunization
    - Id
    - Status
    - VaccineCode
    - Patient
    - OccurrenceDateTime

3. ImmunizationEvaluation
    - Id
    - Status
    - Patient
    - Date
    - Authority
    - TargetDisease
    - DoseStatus
    - DoseNumber


## Patient
Demographics and other administrative information about an individual or animal receiving care or other health-related services.

## Immunization
The Immunization resource is intended to cover the recording of current and historical administration of vaccines to patients across all healthcare disciplines in all care settings and all regions. This includes immunization of both humans and animals but does not include the administration of non-vaccine agents, even those that may have or claim to have immunological effects. While the terms "immunization" and "vaccination" are not clinically identical, for the purposes of the FHIR resources, the terms are used synonymously.

## ImmunizationEvaluation

Describes a comparison of an immunization event against published recommendations to determine if the administration is "valid" in relation to those recommendations.

| Resource               | Property           | AccessPath | XMLTag |
|------------------------|--------------------|------------|--------|
| Patient                | Id                 |            |        |
|                        | BirthDate          |$.entry.*.resource.birthDate|        |
|                        | Gender             |$.entry.*.resource.gender|        |
|                        | Address            |$.entry.*.resource.address|        |
| Immunization           | Id                 |$.entry.*.resource.id|        |
|                        | Status             |            |        |
|                        | VaccineCode        |            |        |
|                        | Patient            |            |        |
|                        | OccurrenceDateTime |            |        |
| ImmunizationEvaluation | ID                 |            |        |
|                        | Status             |            |        |
|                        | Patient            |            |        |
|                        | Date               |            |        |
|                        | Authority          |            |        |
|                        | TargetDisease      |            |        |
|                        | DoseStatus         |            |        |
|                        | DoseNumber         |            |        |



### XML Tag to Add a new Resource

This an example XML Tag to add to the pipeline to be able to add a new JSon Input transform

If you want for example to select another Resource for example Immunization
please replace with specific fields

```xml
<transform>
    <name>JSON input</name>
    <type>JsonInput</type>
    <description/>
    <distribute>N</distribute>
    <custom_distribution/>
    <copies>1</copies>
    <partitioning>
      <method>none</method>
      <schema_name/>
    </partitioning>
    <include>N</include>
    <include_field/>
    <rownum>N</rownum>
    <addresultfile>N</addresultfile>
    <readurl>N</readurl>
    <removeSourceField>N</removeSourceField>
    <IsIgnoreEmptyFile>N</IsIgnoreEmptyFile>
    <doNotFailIfNoFile>Y</doNotFailIfNoFile>
    <ignoreMissingPath>Y</ignoreMissingPath>
    <defaultPathLeafToNull>Y</defaultPathLeafToNull>
    <rownum_field/>
    <file>
      <name/>
      <filemask/>
      <exclude_filemask/>
      <file_required>N</file_required>
      <include_subfolders>N</include_subfolders>
    </file>
    <fields>
      <field>
        <name>birthDate</name>
        <path>$.entry.*.resource.birthDate</path>
        <type>String</type>
        <format/>
        <currency/>
        <decimal/>
        <group/>
        <length>-1</length>
        <precision>-1</precision>
        <trim_type>none</trim_type>
        <repeat>N</repeat>
      </field>
      <field>
        <name>gender</name>
        <path>$.entry.*.resource.gender</path>
        <type>String</type>
        <format/>
        <currency/>
        <decimal/>
        <group/>
        <length>-1</length>
        <precision>-1</precision>
        <trim_type>none</trim_type>
        <repeat>N</repeat>
      </field>
      <field>
        <name>id</name>
        <path>$.entry.*.resource.id</path>
        <type>String</type>
        <format/>
        <currency/>
        <decimal/>
        <group/>
        <length>-1</length>
        <precision>-1</precision>
        <trim_type>none</trim_type>
        <repeat>N</repeat>
      </field>
      <field>
        <name>address</name>
        <path>$.entry.*.resource.address</path>
        <type>String</type>
        <format/>
        <currency/>
        <decimal/>
        <group/>
        <length>-1</length>
        <precision>-1</precision>
        <trim_type>none</trim_type>
        <repeat>N</repeat>
      </field>
    </fields>
    <limit>0</limit>
    <IsInFields>Y</IsInFields>
    <IsAFile>N</IsAFile>
    <valueField>patient</valueField>
    <shortFileFieldName/>
    <pathFieldName/>
    <hiddenFieldName/>
    <lastModificationTimeFieldName/>
    <uriNameFieldName/>
    <rootUriNameFieldName/>
    <extensionFieldName/>
    <sizeFieldName/>
    <attributes/>
    <GUI>
      <xloc>432</xloc>
      <yloc>240</yloc>
    </GUI>
  </transform>
  ```



  A hop have also to be added betwenn the read data to api and Json Input

  and between Json Input and Select values

```xml
   <hop>
      <from>Read-Data-From-API</from>
      <to>JSON input</to>
      <enabled>Y</enabled>
    </hop>
    <hop>
      <from>JSON input</from>
      <to>Select values</to>
      <enabled>Y</enabled>
    </hop>
```