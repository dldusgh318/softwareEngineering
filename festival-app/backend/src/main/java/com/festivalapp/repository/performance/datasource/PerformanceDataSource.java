package com.festivalapp.repository.performance.datasource;

import com.festivalapp.domain.performance.Performance;
import java.util.List;

public interface PerformanceDataSource {

  List<Performance> findAll();
}
