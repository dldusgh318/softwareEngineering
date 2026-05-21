package com.festivalapp.repository.timeline.datasource;

import com.festivalapp.domain.timeline.TimelineEvent;
import java.util.List;

public interface TimelineDataSource {

  List<TimelineEvent> findAll();
}
