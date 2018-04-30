library(tidyverse)

rotten_tibl = read_csv('rotton_tomatoes.csv')
boxoffice_tibl = read_csv('box_office.csv')

joined_tibl <- boxoffice_tibl %>%
  mutate(TITLE=gsub('.{7}$', '', TITLE)) %>%
  mutate(ID=1:length(TITLE)) %>%
  full_join(rotten_tibl) %>%
  na.omit() %>%
  select(ID, TITLE, boxoffice, RATING_VALUE)

write_csv(joined_tibl, "cage_joined.csv")