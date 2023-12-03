### Test Server

Select one from the test servers

https://play.dhis2.org/

username:admin
password:district

In our template Reading-Data-From-DHIS2-Server.hpl we are using the following test server:

https://play.dhis2.org/40.0.0/api/

One example request is:

https://play.dhis2.org/40.0.0/api/analytics?dimension=dx:fbfJHSPpUQD&dimension=pe:LAST_12_MONTHS

https://play.dhis2.org/40.0.0/api/dataSets

Read IST data from djibouti DHIS2:

https://snis-dhis2.gouv.dj/dhis/api/analytics.json?dimension=dx:ziigozNncky;QKmgup86Fye;PEmOXKpPZR9;R5BPlusolD9;X5HRzv4wfX4;HdMxagiCWKX&dimension=pe:LAST_12_MONTHS&dimension=ou:WldKlZ2ePvu;l1O2UMCx1e3;tzEhlDZ3KJc;o8gco2FACA3;xNeUWDH1DIL;znUCPAEhJvD

one important dimension when querying for data is the `ou`

https://snis-dhis2.gouv.dj/dhis/api/organisationUnits/

with this request you will get all possible organisation units (clinics, prefectures and regions)

if for example you only want to get the highest level (regions) you have to search for the highest parent (Djibouti) and have a look at his children to get all regions of djibouti

https://snis-dhis2.gouv.dj/dhis/api/organisationUnits/woYcQIRMIwR

´<children>
<child id="znUCPAEhJvD"/>
<child id="o8gco2FACA3"/>
<child id="WldKlZ2ePvu"/>
<child id="l1O2UMCx1e3"/>
<child id="tzEhlDZ3KJc"/>
<child id="xNeUWDH1DIL"/>
</children>
´

to filter for specific organisation units to retrieve only regions you can add the filter by lever equal 2 query
https://snis-dhis2.gouv.dj/dhis/api/organisationUnits?filter=level:eq:2

More complicated query to retrieve all regions of djibouti with additional information like name, parent , coordinates

https://snis-dhis2.gouv.dj/dhis/api/organisationUnits?filter=level:eq:2&fields=id,level,name,path,geometry,parent[id,name]&paging=false

https://snis-dhis2.gouv.dj/dhis/api/analytics.json?dimension=dx:ziigozNncky;QKmgup86Fye;PEmOXKpPZR9;R5BPlusolD9;X5HRzv4wfX4;HdMxagiCWKX&dimension=pe:LAST_12_MONTHS&dimension=ou:LEVEL-3

Get all dataElements which have Morbidity as dataElementGroup
https://snis-dhis2.gouv.dj/dhis/api/dataElements?filter=dataElementGroups.id:eq:gYgL47r1njG&paging=false
